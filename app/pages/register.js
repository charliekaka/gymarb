const register = () => {
    return (
        <div>
            <div className="authFormContainer">
                <form className="authForm">
                    <input
                    className="authEmail"
                    name="email"
                    type="email"
                    placeholder="Email" />
                    <input
                    className="authUsername"
                    name="username"
                    type="text"
                    placeholder="Username"/>
                    <input
                    className="authPassword"
                    name="password"
                    type="password"
                    placeholder="Password" />
                    <input
                    className="authSumbit"
                    type="submit"
                    value="Register" />
                </form>
            </div>
        </div>
    )
}

export default register