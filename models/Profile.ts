import { DataTypes, Model } from "sequelize";
import { UserAttributes } from "./User";

export interface ProfileAttributes {
  id?: string;
  userId: string;
  name?: string;
  bio?: string;
  headline?: string;
  photoUrl?: string;
  backgroundUrl?: string;
  interests?: string[];
  createdAt?: Date;
  updatedAt?: Date;

  likedByUsers?: UserAttributes[];
}

export const ProfileModel = (sequelize: any) => {
  class Profile extends Model<ProfileAttributes> implements ProfileAttributes {
    public id!: string;
    public userId!: string;
    public name!: string;
    public bio!: string | undefined;
    public headline!: string | undefined;
    public photoUrl!: string | undefined;
    public interests!: string[] | undefined;
    public likedByUsers?: UserAttributes[];
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Profile.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      headline: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      backgroundUrl: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      photoUrl: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      interests: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: "Profile",
      tableName: "profiles",
      timestamps: true,
    }
  );

  return Profile;
};
