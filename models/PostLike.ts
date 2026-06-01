import { DataTypes, Model } from "sequelize";

interface PostLikeAttributes {
  id: string;
  userId: string;
  postId: string;
  createdAt?: Date;
}

export const PostLikeModel = (sequelize: any) => {
  class PostLike
    extends Model<PostLikeAttributes>
    implements PostLikeAttributes
  {
    public id!: string;
    public userId!: string;
    public postId!: string;
    public readonly createdAt!: Date;
  }

  PostLike.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      postId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "posts",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "PostLike",
      tableName: "post_likes",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["userId", "postId"],
        },
      ],
    }
  );

  return PostLike;
};
