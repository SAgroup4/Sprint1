/**
 * 模擬帖子數據
 * 
 * 這個文件用於前端開發階段，模擬後端API返回的帖子數據
 * 當後端和數據庫開發完成後，這個文件將被移除，改為使用真實的API數據
 * 
 * 數據結構：
 * @typedef {Object} Post
 * @property {number} id - 帖子唯一標識
 * @property {string} title - 帖子標題
 * @property {string} content - 帖子內容
 * @property {string} author - 發帖人
 * @property {string} time - 發布時間
 * @property {number} comments - 評論數量
 *
 */

export const posts = [
  {
    id: 1,
    title: '如何準備大學物理期末考？',
    content: '我是物理系大二學生，下週有期末考，有人能分享一些有效的學習方法嗎？',
    author: '物理系學生',
    time: '1小時前',
    comments: 32
  },
  {
    id: 2,
    title: '尋找英文口語交換夥伴',
    content: '我是來自日本的交換生，想找本地學生練習英文口語，可以教你日文作為交換！',
    author: '日本交換生',
    time: '3小時前',
    comments: 24,
  }
];