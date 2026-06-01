import { sequelize } from "../config/database";
import { CommentModel } from "./Comment";
import { FollowModel } from "./Follow";
import { LikeModel } from "./Like";
import { PostModel } from "./Post";
import { PostLikeModel } from "./PostLike";
import { ProfileModel } from "./Profile";
import { UserModel } from "./User";

const User = UserModel(sequelize);
const Profile = ProfileModel(sequelize);
const Follow = FollowModel(sequelize);
const Like = LikeModel(sequelize);
const Post = PostModel(sequelize);
const PostLike = PostLikeModel(sequelize);
const Comment = CommentModel(sequelize);

// Define relationships
User.hasOne(Profile, { foreignKey: "userId", as: "profile" });
User.hasMany(Post, { foreignKey: "userId", as: "posts" });
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });

// Follow relationships
User.belongsToMany(User, {
  through: Follow,
  as: "following",
  foreignKey: "followerId",
  otherKey: "followingId",
});

User.belongsToMany(User, {
  through: Follow,
  as: "followers",
  foreignKey: "followingId",
  otherKey: "followerId",
});

// Like relationships
User.belongsToMany(Profile, {
  through: Like,
  as: "likedProfiles",
  foreignKey: "userId",
});

User.belongsToMany(Post, {
  through: PostLike,
  as: "likedPosts",
  foreignKey: "userId",
});

Post.belongsToMany(User, {
  through: PostLike,
  as: "likedPostByUsers",
  foreignKey: "postId",
});

Profile.belongsTo(User, { foreignKey: "userId", as: "user" });

Profile.belongsToMany(User, {
  through: Like,
  as: "likedByUsers",
  foreignKey: "profileId",
});

Post.belongsTo(User, { foreignKey: "userId", as: "user" });
Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });

Comment.belongsTo(User, { foreignKey: "userId", as: "user" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

export { Comment, Follow, Like, Post, PostLike, Profile, User };
