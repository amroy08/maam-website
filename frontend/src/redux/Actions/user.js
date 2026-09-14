import axios from "axios";
import {server} from "../../server.jsx";

// load user
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({
            type: "LoadUserRequest",
        });
        const {data} = await axios.get(`${server}/user/getUser`, {
            withCredentials: true,
        });
        dispatch({
            type: "LoadUserSuccess",
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type: "LoadUserFail",
            payload: error.response.data.message,
        });
    }
};

// Redux action
export const loadShop = () => async (dispatch) => {
    try {
        dispatch({type: "LoadShopRequest"});

        const {data} = await axios.get(`${server}/shop/getShop`, {
            withCredentials: true,
        });

        dispatch({
            type: "LoadShopSuccess",
            payload: data.shop,
        });

        console.log(data.shop);

    } catch (error) {
        dispatch({
            type: "LoadShopFail",
            payload: error.response?.data?.message || "Failed to load shop",
        });
    }
};

// user update information
export const updateUserInformation =
    (name, email, phoneNumber, password) => async (dispatch) => {
        try {
            dispatch({
                type: "updateUserInfoRequest",
            });

            const {data} = await axios.put(
                `${server}/user/update-user-info`,
                {
                    email,
                    password,
                    phoneNumber,
                    name,
                },
                {
                    withCredentials: true,
                }
            );

            dispatch({
                type: "updateUserInfoSuccess",
                payload: {
                    successMessage: "User information updated successfully!",
                    user: data.user,
                }
            });
        } catch (error) {
            dispatch({
                type: "updateUserInfoFailed",
                payload: error.response.data.message,
            });
        }
    };

// update user address
export const updateUserAddress =
    (country, city, address1, address2, zipCode, addressType) =>
        async (dispatch) => {
            try {
                dispatch({
                    type: "updateUserAddressRequest",
                });

                const {data} = await axios.put(
                    `${server}/user/update-user-addresses`,
                    {
                        country,
                        city,
                        address1,
                        address2,
                        zipCode,
                        addressType,
                    },
                    {withCredentials: true}
                );

                dispatch({
                    type: "updateUserAddressSuccess",
                    payload: {
                        successMessage: "User address updated successfully!",
                        user: data.user,
                    },
                });
            } catch (error) {
                dispatch({
                    type: "updateUserAddressFailed",
                    payload: error.response.data.message,
                });
            }
        };

// delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "deleteUserAddressRequest",
        });

        const {data} = await axios.delete(
            `${server}/user/delete-user-address/${id}`,
            {withCredentials: true}
        );

        dispatch({
            type: "deleteUserAddressSuccess",
            payload: {
                successMessage: "User deleted successfully!",
                user: data.user,
            },
        });
    } catch (error) {
        dispatch({
            type: "deleteUserAddressFailed",
            payload: error.response.data.message,
        });
    }
};

// get all users --- admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllUsersRequest",
    });

    const { data } = await axios.get(`${server}/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllUsersSuccess",
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: "getAllUsersFailed",
      payload: error.response.data.message,
    });
  }
};


// get all sellers --- admin
export const getAllShops = () => async (dispatch) => {
    try {
        dispatch({
            type: "getAllShopsRequest",
        });

        const { data } = await axios.get(`${server}/shop/admin-all-sellers`, {
            withCredentials: true,
        });

        dispatch({
            type: "getAllShopsSuccess",
            payload: data.shops,
        });
    } catch (error) {
        dispatch({
            type: "getAllShopFailed",
            payload: error.response.data.message,
        });
    }
};
