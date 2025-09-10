import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CommentModel } from "@/types/postModel";
import useAuth from "@/hooks/auth/useAuth";
import { CommentForm } from "./CommentForm";

interface CommentItemProps {
  comment: CommentModel;
  onEdit: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

export function CommentItem({ comment, onEdit, onDelete }: CommentItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.id === comment.author.id;

  const handleDelete = async () => {
    if (!isOwner || isDeleting) return;

    try {
      setIsDeleting(true);
      await onDelete(comment.id);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing && isOwner) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <CommentForm
          initialContent={comment.content}
          onCommentSubmit={async (content) => {
            await onEdit(comment.id, content);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">{comment.author.name}</span>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end text-xs text-gray-500">
            <span>Posted: {new Date(comment.createdAt).toLocaleString()}</span>
            {comment.updatedAt !== comment.createdAt && (
              <span className="italic">
                Edited: {new Date(comment.updatedAt).toLocaleString()}
              </span>
            )}
          </div>
          {isOwner && (
            <div className="flex gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          )}
        </div>
      </div>
      <p className="text-gray-700">{comment.content}</p>
    </div>
  );
}
