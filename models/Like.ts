import { DataTypes, Model } from "sequelize";

interface LikeAttributes {
  id: string;
  userId: string;
  profileId: string;
  createdAt?: Date;
}

export const LikeModel = (sequelize: any) => {
  class Like extends Model<LikeAttributes> implements LikeAttributes {
    public id!: string;
    public userId!: string;
    public profileId!: string;
    public readonly createdAt!: Date;
  }

  Like.init(
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
      profileId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "profiles",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Like",
      tableName: "likes",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["userId", "profileId"],
        },
      ],
    }
  );

  return Like;
};
