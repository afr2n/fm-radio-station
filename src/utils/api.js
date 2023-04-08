import axios from "axios";

export const api = {
    get: (url) => {
        return new Promise((resolve, reject) => {
            const info = {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "text/html",
                },
                method: 'get',
                url: url,
            };

            axios(info)
                .then((response) => {
                    console.log("api file get response",response);
                    resolve(response.data);
                })
                .catch((error) => {
                    console.log(info);
                    console.log("error in get ", error);
                    reject(error);
                });
        });
    },
};
