import Post from "../models/Post.js";
import User from "../models/User.js";
import { Comment } from "../models/Post.js";
/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath, to_id, pvp, to_user, mediaType } =
      req.body;
    console.log(mediaType);
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      to_id,
      pvp,
      to_user,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      mediaType,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().populate("comments");
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// set Comment
export const setComment = async (req, res) => {
  try {
    const { _id, firstName, lastName, picturePath } = req.body.user;
    const { postId, commentMessage } = req.body;
    console.log(postId, commentMessage, _id, firstName, lastName, picturePath);

    const newComment = new Comment({
      senderImageUrl: picturePath,
      firstName: firstName,
      lastName: lastName,
      senderId: _id,
      commentText: commentMessage,
    });
    await newComment.save();
    const post = await Post.findById(postId);
    post.comments.push(newComment._id);
    await post.save();
    res
      .status(200)
      .json({ success: true, message: "Comment added successfully" });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate("comments");
    res.status(200).json({ sucess: true, comments: post.comments });
  } catch (err) {
    res.status(404).json({ sucess: false });
  }
};
