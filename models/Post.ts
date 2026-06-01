import { DataTypes, Model } from "sequelize";

interface PostAttributes {
  id?: string;
  userId: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const PostModel = (sequelize: any) => {
  class Post extends Model<PostAttributes> implements PostAttributes {
    public id!: string;
    public userId!: string;
    public title!: string;
    public description!: string;
    public imageUrl!: string | undefined;
    public imageDescription!: string | undefined;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Post.init(
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      imageDescription: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "posts",
      timestamps: true,
    }
  );

  return Post;
};
