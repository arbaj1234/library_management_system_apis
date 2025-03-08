export const sendToken = (user, statusCode, message, res) => {
    try {
        const token = user.generateToken();

        res
            .status(statusCode) 
            .cookie("token", token, {
                expires: new Date(
                    Date.now() + (Number(process.env.COOKIE_EXPIRE) || 1) * 24 * 60 * 60 * 1000  
                ),
                httpOnly: true
            })
            .json({
                success: true,
                user,
                message,
                token
            });

    } catch (error) {
        res.json({ message: "Failed to send token", error: error.message })
    }
};