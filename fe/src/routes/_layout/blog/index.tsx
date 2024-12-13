import { useState, useEffect } from 'react';
import instance from '@/api/axiosIntance';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ChevronRightMini, Tag, TagSolid } from '@medusajs/icons';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const postsPerPage = 8; // Số bài viết mỗi trang

  // Gọi API để lấy danh sách bài viết
  const fetchPosts = async () => {
    try {
      const response = await instance.get('/posts'); // Gửi request GET đến API
      setPosts(response.data.data); // Lưu danh sách bài viết vào state
    } catch (error) {
      console.error('Lỗi khi gọi API:', error.message);
    } finally {
      setLoading(false); // Dừng trạng thái loading
    }
  };

  useEffect(() => {
    fetchPosts(); // Gọi API khi component được mount
  }, []);

  // Tính toán bài viết trên trang hiện tại
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Số trang tổng cộng
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Chuyển trang
  const paginate = pageNumber => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {/* Title page */}
      <div className="main-content flex h-48 w-full flex-col items-center justify-center">
        <div className="text-content">
          <div className="text-center text-4xl font-semibold">Blog</div>
          <div className="link caption1 mt-3 flex items-center justify-center gap-1">
            <div className="flex items-center justify-center">
              <Link to="/">Trang chủ</Link>
              <ChevronRightMini />
            </div>
            <div className="flex items-center justify-center">
              <Link to="/blog">Blog</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Blog section */}
      <section className="bg-gray-100 py-16">
        <div className="m-auto max-w-7xl rounded-lg bg-white p-8 shadow-md">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-800">
              Tin tức mới nhất
            </h3>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="text-center text-gray-500">Đang tải...</div>
          ) : currentPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {/* Dynamic blog posts */}
                {currentPosts.map(post => (
                  <div
                    key={post._id}
                    className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
                  >
                    <Link to={`/detailblog/${post.slug}`} className="block">
                      <img
                        src={post.thumbnail || 'https://picsum.photos/300/200'}
                        className="h-56 w-full rounded-t-lg object-cover"
                      />
                    </Link>
                    <div className="p-4">
                      <h5 className="mb-2 text-lg font-semibold text-gray-800">
                        <Link
                          to={`/detailblog/${post.slug}`}
                          className="transition-colors duration-300 hover:text-blue-500"
                        >
                          {post.title}
                        </Link>
                      </h5>
                      <p className="line-clamp-2 flex items-center space-x-2 text-xs text-gray-700">
                        <Tag />
                        <span>{post.tags}</span>
                      </p>
                      <i className="mb-2 text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </i>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`mx-1 rounded-lg px-4 py-2 ${
                      currentPage === index + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    } transition hover:bg-blue-500 hover:text-white`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              Không có bài viết nào.
            </div>
          )}
        </div>
      </section>
    </>
  );
};

// Định nghĩa route cho trang Blog
export const Route = createFileRoute('/_layout/blog/')({
  component: BlogPage,
});

export default BlogPage;
