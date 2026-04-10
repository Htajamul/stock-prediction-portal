import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASE_API
const axiosInstance = axios.create({
    baseURL:baseURL,
    headers:{
        "Content-Type":"application/json",
    }
})

// Request interceptor
// here we modify req by injecting accessToken
axiosInstance.interceptors.request.use(
    function(config){  // config  is req
        const accessToken = localStorage.getItem('accessToken')
        if(accessToken){
            // set access token in hedders in req
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config
    },
    function(error){
        return Promise.reject(error)
    }
)

// RESPONSE INTERCEPTOR
// bcoz we want to check 401(unauthorized){bcoz eccess token life time is generally 15 min } error in the response
// so that we send refresh token to the backend which send new 

axiosInstance.interceptors.response.use(
    // Runs when response is successful (status 2xx)
    function(response){
        return response
    },
    // Hnadle failed responses
    // Runs when response has error (4xx, 5xx)
    async function(error){
        // Original request that failed
        const originalRequest = error.config;
        // Check:
        // 1. Unauthorized error (401)
        // 2. Request not retried yet (avoid infinite loop)
        if(error.response.status===401 && !originalRequest.retry){
            // Mark request as retried
            originalRequest.retry=true;
            const refreshToken = localStorage.getItem('refreshToken')
            try {
                // get new access token
                const res = await axiosInstance.post('token/refresh/',{refresh:refreshToken})
                // // set access token in localStorage
                // console.log(res.data.access,"new access token")
                localStorage.setItem('accessToken',res.data.access)
                // set access token in hedders 
                originalRequest.headers['Authorization']=`Bearer ${res.data.access}`
                return axiosInstance(originalRequest)
            } catch (error) {
                // this block only executes when we came again after 1 or 2 days
                // and login this this block executes bcoz life time of REFRESH TOKEN in only 1 day
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                // window.location.href = "/login";
            }
        }
        return Promise.reject(error)
    }

)



export default axiosInstance


