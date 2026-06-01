import { DataTypes, Model } from "sequelize";

interface CommentAttributes {
  id?: string;
  userId: string;
  postId: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const CommentModel = (sequelize: any) => {
  class Comment extends Model<CommentAttributes> implements CommentAttributes {
    public id!: string;
    public userId!: string;
    public postId!: string;
    public content!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Comment.init(
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
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "comments",
      timestamps: true,
    }
  );

  return Comment;
};
