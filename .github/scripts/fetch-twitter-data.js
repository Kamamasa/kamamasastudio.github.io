const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 環境変数から認証情報を取得
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const USER_ID = process.env.TWITTER_USER_ID;

if (!BEARER_TOKEN || !USER_ID) {
    console.error('環境変数が設定されていません');
    process.exit(1);
}

const headers = {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json',
};

async function fetchUserInfo() {
    try {
        const response = await axios.get(
            `https://api.twitter.com/2/users/${USER_ID}?user.fields=public_metrics`,
            { headers }
        );
        
        const user = response.data.data;
        return {
            name: user.name,
            username: user.username,
            followers_count: user.public_metrics.followers_count,
            following_count: user.public_metrics.following_count,
            tweet_count: user.public_metrics.tweet_count
        };
    } catch (error) {
        console.error('ユーザー情報取得エラー:', error.response?.data || error.message);
        throw error;
    }
}

async function fetchRecentTweets() {
    try {
        const response = await axios.get(
            `https://api.twitter.com/2/users/${USER_ID}/tweets?max_results=10&tweet.fields=created_at,public_metrics&exclude=retweets,replies`,
            { headers }
        );
        
        const tweets = response.data.data || [];
        return tweets.map(tweet => ({
            text: tweet.text,
            created_at: tweet.created_at,
            reply_count: tweet.public_metrics.reply_count,
            retweet_count: tweet.public_metrics.retweet_count,
            like_count: tweet.public_metrics.like_count,
            quote_count: tweet.public_metrics.quote_count
        }));
    } catch (error) {
        console.error('ツイート取得エラー:', error.response?.data || error.message);
        throw error;
    }
}

async function main() {
    try {
        console.log('Twitter データを取得中...');
        
        const [userInfo, tweets] = await Promise.all([
            fetchUserInfo(),
            fetchRecentTweets()
        ]);
        
        const data = {
            lastUpdated: new Date().toISOString(),
            user: userInfo,
            tweets: tweets
        };
        
        // ディレクトリが存在しない場合は作成
        const outputDir = path.dirname('site_data/json/twitter_data.json');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // JSONファイルに保存
        fs.writeFileSync(
            'site_data/json/twitter_data.json',
            JSON.stringify(data, null, 2),
            'utf8'
        );
        
        console.log('Twitter データの更新が完了しました');
        console.log(`フォロワー数: ${userInfo.followers_count}`);
        console.log(`ツイート数: ${tweets.length}件取得`);
        
    } catch (error) {
        console.error('メインプロセスエラー:', error);
        process.exit(1);
    }
}

main();