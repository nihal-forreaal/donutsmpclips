export default async function handler(req, res) {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

    // Set CORS headers just in case
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (!API_KEY || !CHANNEL_ID) {
        return res.status(200).json({
            error: "API Key or Channel ID missing. Using fallback data.",
            stats: { subscriberCount: "100000", viewCount: "5000000", videoCount: "300" },
            videos: []
        });
    }

    try {
        // Fetch Channel Stats
        const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
        const statsRes = await fetch(statsUrl);
        const statsData = await statsRes.json();
        
        let stats = {
            subscriberCount: "100000",
            viewCount: "5000000",
            videoCount: "300"
        };

        if (statsData.items && statsData.items.length > 0) {
            stats = statsData.items[0].statistics;
        }

        // Fetch Latest Videos
        const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=8&order=date&type=video&key=${API_KEY}`;
        const videosRes = await fetch(videosUrl);
        const videosData = await videosRes.json();
        
        let videos = [];
        if (videosData.items) {
            videos = videosData.items.map(item => ({
                id: item.id ? item.id.videoId : null,
                title: item.snippet ? item.snippet.title : '',
                thumbnail: item.snippet && item.snippet.thumbnails && item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : (item.snippet && item.snippet.thumbnails && item.snippet.thumbnails.medium ? item.snippet.thumbnails.medium.url : '')
            })).filter(v => v.id);
        }

        // Cache the response on Vercel Edge for 1 hour to prevent API quota limits
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        res.status(200).json({ stats, videos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch YouTube data" });
    }
}
