import { DataTypes, Model } from "sequelize";

interface FollowAttributes {
  id: string;
  followerId: string;
  followingId: string;
  createdAt?: Date;
}

export const FollowModel = (sequelize: any) => {
  class Follow extends Model<FollowAttributes> implements FollowAttributes {
    public id!: string;
    public followerId!: string;
    public followingId!: string;
    public readonly createdAt!: Date;
  }

  Follow.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      followerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      followingId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Follow",
      tableName: "follows",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["followerId", "followingId"],
        },
      ],
    }
  );

  return Follow;
};
