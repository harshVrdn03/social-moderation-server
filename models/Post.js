import mongoose from "mongoose";
const { ObjectId } = mongoose;
const commentSchema = new mongoose.Schema({
  senderImageUrl: String,
  firstName: String,
  lastName: String,
  senderId: String,

  commentText: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    to_id: String,
    pvp: String,
    to_user: String,
    media: String,
    mediaType: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", // Reference to the Comment model
      },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
const Post = mongoose.model("Post", postSchema);
export { Comment };
export default Post;
