
module.exports = function(sequelize, DataTypes) {
    var Agent = sequelize.define(
        // modelName
        'agent',

        // attributes
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                defaultValue: 0
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ""
            },
            ctor: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ""
            }
        },

        // options
        {
            tableName: "agents",
            timestamps: false
        }
    );

    return Agent;
};
