'use client';

import PostDetail from './PostDetail';

export default function Page() {
  return <PostDetail />;
}






































// 'use client'; // 設為 Client Component，確保可以使用交互

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import './styles.css';

// interface Comment {
//   id: number;
//   author: string;
//   content: string;
//   timestamp: string;
// }

// interface PostDetailProps {
//   post: {
//     id: number;
//     title: string;
//     content: string;
//     author: string;
//     timestamp: string;
//   };
//   comments: Comment[];
// }

// const PostDetail: React.FC<PostDetailProps> = () => {
//   const router = useRouter();
//   const [comments, setComments] = useState<Comment[]>([
//     {
//       id: 1,
//       author: '評論A',
//       content: '++',
//       timestamp: '今天 08:30',
//     },
//     {
//       id: 2,
//       author: '評論B',
//       content: '++',
//       timestamp: '今天 09:00',
//     },
//   ]);

//   const [newComment, setNewComment] = useState(''); // 新增評論的狀態

//   const post = {
//     id: 1,
//     title: '徵多益夥伴',
//     content: '今年8月底要考多益...',
//     author: '作者A',
//     timestamp: '今天 01:39',
//   };

//   const handleAddComment = () => {
//     if (!newComment.trim()) {
//       alert('請輸入評論內容');
//       return;
//     }

//     const newCommentObj: Comment = {
//       id: comments.length + 1,
//       author: '匿名', // 預設評論者名稱
//       content: newComment,
//       timestamp: '剛剛',
//     };

//     setComments([newCommentObj, ...comments]); // 將新評論加入評論列表
//     setNewComment(''); // 清空輸入框
//   };

//   return (
//     <div className="post-detail-container">
//       <div className="post-header">
//         <button className="back-button" onClick={() => router.back()}>
//           返回
//         </button>
//         <h1 className="post-title">{post.title}</h1>
//       </div>
//       <div className="post-meta">
//         <div className="author-info">
//           <img src="/default-avatar.png" alt="頭貼" className="author-avatar" />
//           <span className="post-author">{post.author}</span>
//           <button className="message-button">私訊</button>
//         </div>
//         <span className="post-timestamp">{post.timestamp}</span>
//       </div>
//       <div className="post-content">{post.content}</div>
//       <hr className="divider" />
//       <h2 className="comments-title">全部留言</h2>

//       <div className="comments-list">
//         {comments.map((comment) => (
//           <div key={comment.id} className="comment-item">
//             <div className="comment-meta">
//               <div className="author-info">
//                 <img src="/default-avatar.png" alt="頭貼" className="author-avatar" />
//                 <span className="comment-author">{comment.author}</span>
//                 <button className="message-button">私訊</button>
//               </div>
//               <span className="comment-timestamp">{comment.timestamp}</span>
//             </div>
//             <div className="comment-content">{comment.content}</div>
//           </div>
//         ))}
//       </div>

//       {/* 新增評論輸入框 */}
//       <div className="add-comment">
//         <textarea
//           className="comment-input"
//           placeholder="輸入你的評論..."
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//         />
//         <button className="submit-comment-button" onClick={handleAddComment}>
//           提交評論
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PostDetail;