
module.exports = function(sequelize, DataTypes) {
    var Credit = sequelize.define(
        // modelName
        'credit',

        // attributes
        {
            userID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                defaultValue: 0
            },
            currency: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ""
            },
            balance: {
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
            tableName: "credits",
            timestamps: true
        }
    );

    return Credit;
};
