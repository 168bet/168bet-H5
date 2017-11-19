
module.exports = function(sequelize, DataTypes) {
    var Profile = sequelize.define(
        // modelName
        'profile',

        // attributes
        {
            userID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                defaultValue: 0
            },
            gameID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                defaultValue: 0
            },
            data: {
                type: DataTypes.BLOB,
                allowNull: false,
                get: function() {
                    return JSON.parse(this.getDataValue('data'))
                }
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
            tableName: "profiles",
            timestamps: true
        }
    );

    return Profile;
};
