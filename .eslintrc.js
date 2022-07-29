module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "allow": "_id",
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "airbnb-base"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
    }
}
