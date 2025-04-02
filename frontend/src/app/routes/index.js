import { useRouter } from 'next/router';

const ForumCategoryPage = () => {
  const router = useRouter();
  const { category } = router.query; // 獲取網址中的 category 參數

  return (
    <div>
      <h1>{category} 討論區</h1>
      <p>這是 {category} 分類的討論區內容。</p>
    </div>
  );
};

export default ForumCategoryPage;