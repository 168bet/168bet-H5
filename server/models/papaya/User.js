
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define(
        // modelName
        'user',

        // attributes
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            account: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ""
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ""
            },
            nickName: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ""
            },
            udid: {
                type: DataTypes.STRING(36),
                allowNull: false,
                defaultValue: DataTypes.UUIDV4
            },
            agent: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ""
            },
            currency: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "TOKEN"
            },
            balance: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            language: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "zh-CN"
            },
            trial: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },

        // options
        {
            timestamps: true
        }
    );

    return User;
};
