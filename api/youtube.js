export default async function handler(req, res) {
    const API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyC1jYYQ8p0YSKgKRG7xrUavLB_Np_iN5ho';
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCwSdVt7FNixRV5JkmtZZw0A';

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    try {
        // Fetch Channel Stats & Uploads Playlist
        const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics,contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`;
        const statsRes = await fetch(statsUrl);
        const statsData = await statsRes.json();
        
        let stats = {
            subscriberCount: "29",
            viewCount: "3500",
            videoCount: "9"
        };

        let uploadsPlaylistId = 'UU' + CHANNEL_ID.substring(2);
        if (statsData.items && statsData.items.length > 0) {
            stats = statsData.items[0].statistics;
            if (statsData.items[0].contentDetails && statsData.items[0].contentDetails.relatedPlaylists && statsData.items[0].contentDetails.relatedPlaylists.uploads) {
                uploadsPlaylistId = statsData.items[0].contentDetails.relatedPlaylists.uploads;
            }
        }

        // Fetch Uploaded Videos (playlistItems is 100x cheaper than search & gets exact upload order)
        let videoIds = [];
        try {
            const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${uploadsPlaylistId}&maxResults=30&key=${API_KEY}`;
            const playlistRes = await fetch(playlistUrl);
            const playlistData = await playlistRes.json();
            if (playlistData.items && playlistData.items.length > 0) {
                videoIds = playlistData.items.map(i => i.contentDetails.videoId);
            }
        } catch (e) {
            console.error("Playlist fetch failed, falling back to search", e);
        }

        // Fallback to search if playlistItems failed
        if (videoIds.length === 0) {
            const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=15&order=date&type=video&key=${API_KEY}`;
            const searchRes = await fetch(searchUrl);
            const searchData = await searchRes.json();
            if (searchData.items) {
                videoIds = searchData.items.map(i => i.id.videoId).filter(Boolean);
            }
        }
        
        let longForm = [];
        let shorts = [];
        let latest = null;

        if (videoIds.length > 0) {
            const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,statistics&id=${videoIds.join(',')}&key=${API_KEY}`;
            const detailsRes = await fetch(detailsUrl);
            const detailsData = await detailsRes.json();

            const parseDuration = (durStr) => {
                if (!durStr) return 0;
                const match = durStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
                if (!match) return 0;
                const hours = parseInt(match[1] || 0, 10);
                const minutes = parseInt(match[2] || 0, 10);
                const seconds = parseInt(match[3] || 0, 10);
                return hours * 3600 + minutes * 60 + seconds;
            };

            if (detailsData.items) {
                let totalVideoViews = 0;

                const allVideos = detailsData.items.map(item => {
                    const durationSec = parseDuration(item.contentDetails ? item.contentDetails.duration : '');
                    const isShort = durationSec > 0 && durationSec <= 180;
                    const thumbs = item.snippet && item.snippet.thumbnails ? item.snippet.thumbnails : {};
                    const highResThumb = (thumbs.maxres && thumbs.maxres.url) ||
                                         (thumbs.standard && thumbs.standard.url) ||
                                         (thumbs.high && thumbs.high.url) ||
                                         `https://i.ytimg.com/vi/${item.id}/maxresdefault.jpg`;

                    // For Shorts: use native vertical 1080x1920 (oar2.jpg)
                    const thumb = isShort ? `https://i.ytimg.com/vi/${item.id}/oar2.jpg` : highResThumb;
                    const views = parseInt(item.statistics ? item.statistics.viewCount : '0', 10) || 0;
                    totalVideoViews += views;

                    return {
                        id: item.id,
                        title: item.snippet ? item.snippet.title : '',
                        thumbnail: thumb,
                        fallbackThumbnail: highResThumb,
                        durationSec: durationSec,
                        isShort: isShort,
                        views: views
                    };
                });

                // YouTube channels.statistics.viewCount lags behind Studio by days/weeks.
                // Calculating the sum of actual video views gives the real-time accurate view count matching YouTube Studio!
                const channelViewCount = parseInt(stats.viewCount || '0', 10);
                stats.viewCount = String(Math.max(channelViewCount, totalVideoViews));

                if (allVideos.length > 0) {
                    latest = allVideos[0];
                }

                longForm = allVideos.filter(v => !v.isShort);
                shorts = allVideos.filter(v => v.isShort);
            }
        }

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.status(200).json({ stats, latest, longForm, shorts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch YouTube data" });
    }
}
