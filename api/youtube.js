export default async function handler(req, res) {
    const API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyC1jYYQ8p0YSKgKRG7xrUavLB_Np_iN5ho';
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCwSdVt7FNixRV5JkmtZZw0A';

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    try {
        // Fetch Channel Stats
        const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
        const statsRes = await fetch(statsUrl);
        const statsData = await statsRes.json();
        
        let stats = {
            subscriberCount: "23",
            viewCount: "687",
            videoCount: "7"
        };

        if (statsData.items && statsData.items.length > 0) {
            stats = statsData.items[0].statistics;
        }

        // Fetch Video Details (to get duration & categorize Shorts vs Long Form)
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=15&order=date&type=video&key=${API_KEY}`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        
        let longForm = [];
        let shorts = [];
        let latest = null;

        if (searchData.items && searchData.items.length > 0) {
            const videoIds = searchData.items.map(i => i.id.videoId).join(',');
            const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`;
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
                const allVideos = detailsData.items.map(item => {
                    const durationSec = parseDuration(item.contentDetails ? item.contentDetails.duration : '');
                    return {
                        id: item.id,
                        title: item.snippet ? item.snippet.title : '',
                        thumbnail: item.snippet && item.snippet.thumbnails && item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : (item.snippet && item.snippet.thumbnails && item.snippet.thumbnails.medium ? item.snippet.thumbnails.medium.url : ''),
                        durationSec: durationSec,
                        isShort: durationSec > 0 && durationSec <= 60
                    };
                });

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
