
module.exports = function(sequelize, DataTypes) {
    var Game = sequelize.define(
        // modelName
        'game',

        // attributes
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                defaultValue: 0
            },
            gameId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ""
            },
            url: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ""
            },
            icon: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ""
            },
            brief: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ""
            },
            describe: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ""
            }
        },

        // options
        {
            tableName: "games",
            timestamps: false
        }
    );

    return Game;
};
