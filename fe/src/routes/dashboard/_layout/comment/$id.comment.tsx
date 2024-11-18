import instance from '@/api/axiosIntance';
import Header from '@/components/layoutAdmin/header/header';
import { useEffect, useState } from 'react';
import { Table, Input, DropdownMenu, toast, usePrompt } from '@medusajs/ui';

import { EllipsisVertical } from '@medusajs/icons';
import { createFileRoute, useParams } from '@tanstack/react-router';
export const Route = createFileRoute('/dashboard/_layout/comment/$id/comment')({
    component: CommentList,
  });
function CommentList() {
  const { id} = useParams({from:'/dashboard/_layout/comment/$id/comment'}); // Lấy id sản phẩm từ URL
  const [comments, setComments] = useState([]);
  const [product, setProduct] = useState(null);
  const dialog = usePrompt();

  // Fetch comments dựa trên productId
  useEffect(() => {
    const fetchComments = async () => {   
      if (product) {
        toast.error('Không tìm thấy ID sản phẩm');
        return;
      }
      console.log('Fetching comments for product ID:', id); // Log productId để kiểm tra
  
      try {
        const response = await instance.get(`/comments/product/${id}`);
        console.log('Fetched comments:', response.data); // Log dữ liệu bình luận trả về
        setComments(response.data);
      } catch (err) {
        console.error('Error fetching comments:', err.response?.data || err.message);
        toast.error('Không thể tải bình luận');
      }
    };
  
    fetchComments();
  }, [product]);

  // Xóa một bình luận
  const deleteEntity = async (_id: string) => {
    const userHasConfirmed = await dialog({
      title: 'Xóa bình luận',
      description: 'Bạn chắc chắn muốn xóa bình luận này không?',
    });
  
    if (userHasConfirmed) {
      try {
        console.log('Deleting comment with ID:', _id); // Log ID của bình luận bị xóa
        await instance.delete(`/comments/${_id}/admin`); // Sử dụng đúng comment ID
        setComments(prevComments => prevComments.filter(comment => comment._id !== _id)); // Cập nhật state
        toast.success('Đã xóa bình luận');
      } catch (err) {
        
        toast.error(err.response?.data?.message || 'Không thể xóa bình luận');
      }
    }
  };
  

  return (
    <div className="h-screen overflow-y-auto">
      <Header title="Danh sách Bình luận" pathname="/" />
      <div className="relative flex justify-between px-6 py-4">
        <div className="relative w-80">
          <Input
            className="bg-ui-bg-base"
            placeholder="Tìm kiếm"
            id="search-input"
            size="small"
            type="search"
          />
        </div>
      </div>

      <div className="mx-6 flex flex-col gap-1 rounded-lg border border-gray-200 bg-ui-bg-base px-6 py-4">
        <Table>
          <Table.Row className="bg-ui-bg-base-hover">
            <Table.HeaderCell className="font-semibold text-ui-fg-base"></Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">Tên người dùng</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">Email người dùng</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">Đánh giá</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">Bình luận</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">Ngày tạo</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base"></Table.HeaderCell>
          </Table.Row>
          <Table.Body>
  {comments.length > 0 ? (
    comments.map(comment => (
      <Table.Row
        key={comment._id}
        className="[&_td:last-child]:w-[10%] [&_td:last-child]:whitespace-nowrap"
      >
        <Table.Cell>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <button type="button" className="outline-none">
                <EllipsisVertical />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="space-y-2">
              <DropdownMenu.Item
                className="gap-x-2"
                onClick={() => deleteEntity(comment._id)}
              >
                Xóa
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </Table.Cell>
        <Table.Cell className="font-semibold text-ui-fg-base">
          {comment.userId?.username || 'Người dùng ẩn danh'}
        </Table.Cell>
        <Table.Cell className="font-semibold text-ui-fg-base">
          {comment.userId?.email || 'Người dùng ẩn danh'}
        </Table.Cell>
        
        <Table.Cell className="font-semibold text-ui-fg-base">
          {comment.rating || 'Không có đánh giá'}/5
        </Table.Cell>
        <Table.Cell className="font-semibold text-ui-fg-base">
          {comment.commentText || 'Không có bình luận'}
        </Table.Cell>
        <Table.Cell className="font-semibold text-ui-fg-base">
          {new Date(comment.createdAt).toLocaleString()}
        </Table.Cell>
      </Table.Row>
    ))
  ) : (
    <Table.Row>
      <Table.Cell className="text-center" colSpan={6}>
        Không có bình luận nào
      </Table.Cell>
    </Table.Row>
  )}
</Table.Body>

        </Table>
      </div>
    </div>
  );
}

export default CommentList;
