
module.exports = function(sequelize, DataTypes) {
    var Record = sequelize.define(
        // modelName
        'record',

        // attributes
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            gameID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            userID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            turnID: {
                type: DataTypes.STRING(36),
                allowNull: false,
                defaultValue: ""
            },
            beforeCredit: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            betAmount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            profitAmount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            afterCredit: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            data: {
                type: DataTypes.TEXT,
                allowNull: false
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

    return Record;
};
