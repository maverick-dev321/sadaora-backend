import bcrypt from "bcryptjs";
import { DataTypes, Model, Optional } from "sequelize";
import { ProfileAttributes } from "./Profile";

export interface UserAttributes {
  id: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;

  profile?: ProfileAttributes;
  followers?: UserAttributes[];
  following?: UserAttributes[];
  likedProfiles?: ProfileAttributes[];
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    "id" | "isVerified" | "createdAt" | "updatedAt"
  > {}

export const UserModel = (sequelize: any) => {
  class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
  {
    public id!: string;
    public email!: string;
    public password!: string;
    public isVerified!: boolean;
    public verificationToken!: string | null;
    public resetPasswordToken!: string | null;
    public resetPasswordExpires!: Date | null;

    public profile?: ProfileAttributes;
    public followers?: UserAttributes[];
    public following?: UserAttributes[];
    public likedProfiles?: ProfileAttributes[];

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public async comparePassword(candidatePassword: string): Promise<boolean> {
      return bcrypt.compare(candidatePassword, this.password);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      hooks: {
        beforeSave: async (user: User) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  return User;
};
