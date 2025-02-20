import sharp from "sharp";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import cloudinary from "../utils/cloudinary.js";

// for web

// export const addNewPost = async (req, res) => {
//   const _dummyCategoryForImport = Category;

//   try {
//     const {
//       caption,
//       description,
//       location,
//       price,
//       category: category,
//     } = req.body;
//     const image = req.file;
//     const authorId = req.id;

//     // Validate required fields
//     if (!image) {
//       return res
//         .status(400)
//         .json({ message: "Image required", success: false });
//     }
//     // Validate required fields

//     if (!caption || !price || !description) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     // Optimize and upload image
//     const optimizedImageBuffer = await sharp(image.buffer)
//       .resize({ width: 800, height: 800, fit: "inside" })
//       .toFormat("jpeg", { quality: 80 })
//       .toBuffer();

//     const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
//       "base64"
//     )}`;
//     const cloudResponse = await cloudinary.uploader.upload(fileUri);

//     // Create post
//     const post = await Post.create({
//       caption,
//       price,
//       description,
//       location,
//       category: Array.isArray(category) ? category : [category], // Ensure category is an array
//       image: cloudResponse.secure_url,
//       author: authorId,
//     });

//     // Add post to user's posts
//     const user = await User.findById(authorId);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "User not found", success: false });
//     }
//     user.posts.push(post._id);
//     await user.save();

//     // Populate author and category fields
//     await post.populate([
//       { path: "author", select: "-password" },
//       { path: "category" },
//     ]);

//     return res.status(201).json({
//       message: "New post added",
//       post,
//       success: true,
//     });
//   } catch (error) {
//     console.error(error);
//     let message = "Internal server error";
//     if (error.name === "ValidationError") {
//       message = "Invalid Input Data";
//       return res.status(400).json({
//         message,
//         success: false,
//         errors: error.errors,
//       });
//     } else if (error.name === "CastError") {
//       message = "Invalid ID";
//       return res.status(400).json({
//         message,
//         success: false,
//         errors: error.message,
//       });
//     }
//     return res.status(500).json({ message, success: false });
//   }
// };

//  for  mobile

// export const addNewPost = async (req, res) => {
//   try {
//     const { caption, description, price, location, category, image } = req.body;
//     const author = req.user ? req.user._id : null; // Assuming you have a user in `req.user` (authenticated user)

//     // // Ensure image and author are provided
//     // if (!image) {
//     //   return res.status(400).json({ message: "Image is required" });
//     // }

//     // if (!author) {
//     //   return res.status(400).json({ message: "Author is required" });
//     // }

//     // Proceed with adding the post
//     const newPost = new Post({
//       caption,
//       description,
//       price,
//       location,
//       category,
//       image,
//       author, // Use the ObjectId of the authenticated user
//     });

//     await newPost.save();
//     res.status(201).json(newPost);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// working fine for mobile
// export const addNewPost = async (req, res) => {
//   try {
//     const { caption, description, price, location, category, image } = req.body;

//     if (!req.user || !req.user._id) {
//       return res
//         .status(401)
//         .json({ success: false, message: "User not authenticated" });
//     }

//     const author = req.user._id; // ✅ Assign authenticated user's ID as author

//     // ✅ Ensure required fields are provided
//     if (!image) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Image is required" });
//     }

//     if (!category) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Category is required" });
//     }

//     // ✅ Proceed with creating the post
//     const newPost = new Post({
//       caption,
//       description,
//       price,
//       location,
//       category,
//       image,
//       author, // ✅ Assign authenticated user
//     });

//     await newPost.save();
//     res.status(201).json({ success: true, post: newPost });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export const addNewPost = async (req, res) => {
//   try {
//     const { caption, description, price, location, category, image } = req.body;

//     if (!req.user || !req.user._id) {
//       return res
//         .status(401)
//         .json({ success: false, message: "User not authenticated" });
//     }

//     const author = req.user._id;

//     // ✅ Ensure required fields are provided
//     if (!image) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Image is required" });
//     }

//     if (!category) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Category is required" });
//     }

//     // ✅ Create the post
//     let newPost = new Post({
//       caption,
//       description,
//       price,
//       location,
//       category,
//       image,
//       author,
//     });

//     await newPost.save();

//     // ✅ Populate the author and category fields properly
//     newPost = await Post.findById(newPost._id)
//       .populate({ path: "author", select: "name email" }) // ✅ Exclude password
//       .populate({ path: "category", select: "name" }); // ✅ Only include category name

//     res.status(201).json({ success: true, post: newPost });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export const addNewPost = async (req, res) => {
  try {
    const { caption, description, price, location, category, image } = req.body;

    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const author = req.user._id; // ✅ Assign authenticated user as author

    // ✅ Ensure required fields are provided
    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Category is required" });
    }

    // ✅ Create the post
    let newPost = new Post({
      caption,
      description,
      price,
      location,
      category,
      image,
      author,
    });

    await newPost.save();

    // ✅ Populate author and category before returning response
    newPost = await Post.findById(newPost._id)
      .populate("author", "username email image") // ✅ Populate author details
      .populate("category", "name"); // ✅ Populate category name

    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: 1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: 1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      })
      .populate({
        path: "category",
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: 1 })
      .populate({
        path: "author",
        select: "username, profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: 1 },
        populate: {
          path: "author",
          select: "username, profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const likePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // like logic started
    await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
    await post.save();

    // implement socket io for real time notification
    const user = await User.findById(likeKrneWalaUserKiId).select(
      "username profilePicture"
    );

    const postOwnerId = post.author.toString();
    if (postOwnerId !== likeKrneWalaUserKiId) {
      // emit a notification event
      const notification = {
        type: "like",
        userId: likeKrneWalaUserKiId,
        userDetails: user,
        postId,
        message: "Your post was liked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {}
};
export const dislikePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // like logic started
    await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
    await post.save();

    // implement socket io for real time notification
    const user = await User.findById(likeKrneWalaUserKiId).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();
    if (postOwnerId !== likeKrneWalaUserKiId) {
      // emit a notification event
      const notification = {
        type: "dislike",
        userId: likeKrneWalaUserKiId,
        userDetails: user,
        postId,
        message: "Your post was liked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {}
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKrneWalaUserKiId = req.id;

    const { text } = req.body;

    const post = await Post.findById(postId);

    if (!text)
      return res
        .status(400)
        .json({ message: "text is required", success: false });

    const comment = await Comment.create({
      text,
      author: commentKrneWalaUserKiId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username profilePicture"
    );

    if (!comments)
      return res
        .status(404)
        .json({ message: "No comments found for this post", success: false });

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
  }
};
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // check if the logged-in user is the owner of the post
    // if (post.author.toString() !== authorId)
    //   return res.status(403).json({ message: "Unauthorized" });

    // delete post
    await Post.findByIdAndDelete(postId);

    // remove the post id from the user's post
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    // delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    console.log(error);
  }
};
export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      // already bookmarked -> remove from the bookmark
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post removed from bookmark",
        success: true,
      });
    } else {
      // bookmark krna pdega
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ type: "saved", message: "Post bookmarked", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const { caption, description, location, price } = req.body;
    const image = req.file;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    if (post.author.toString() !== authorId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not the owner of this post" });
    }

    // Prepare the update object
    const updateData = {
      caption,
      description,
      location,
      price,
    };
    // Optimize and upload image only if it's present
    if (image) {
      const optimizedImageBuffer = await sharp(image.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
        "base64"
      )}`;
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      updateData.image = cloudResponse.secure_url;
    }

    // Perform the update
    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
      new: true,
      runValidators: true,
    });

    // Populate author and category fields
    await updatedPost.populate([
      { path: "author", select: "-password" },
      { path: "category" },
    ]);

    return res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
      success: true,
    });
  } catch (error) {
    console.error("Error updating post:", error);

    let message = "Internal server error";
    if (error.name === "ValidationError") {
      message = "Invalid Input Data";
      return res.status(400).json({
        message,
        success: false,
        errors: error.errors,
      });
    } else if (error.name === "CastError") {
      message = "Invalid ID";
      return res.status(400).json({
        message,
        success: false,
        errors: error.message,
      });
    }
    return res.status(500).json({ message, success: false });
  }
};
// export const getPostById = async (req, res) => {
//   console.log("Incoming request for post ID:", req.params.id); // ✅ Add this

//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Post not found" });
//     }
//     res.status(200).json({ success: true, post });
//   } catch (error) {
//     console.error("Error fetching post:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// export const getPostById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const post = await Post.findById(id).populate("category"); // 🔥 This populates the category field

//     if (!post) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Post not found" });
//     }

//     return res.status(200).json({ success: true, post });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username email image")
      .populate("category", "name");

    console.log("DEBUG - Post Response:", post); // ✅ Log the output

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error("DEBUG - Error Fetching Post:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
