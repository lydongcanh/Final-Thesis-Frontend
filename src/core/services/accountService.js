import BaseService from "./baseService";
import { accountsEndpoint } from "../apis/endpoints";
import { validateUsername, validatePassword } from "../validations";
import { Texts } from "../texts";

const ACCOUNT_TYPES = {
    Admin: "Admin",
    Customer: "Customer",
    Employee: "Employee"
};

class AccountService extends BaseService {

    constructor() {
        super(accountsEndpoint);
    }

    async login(username, password) {
        const result = await this.query({ username, password });
        if (result.data.length == 1)
            return { account: result.data[0] };

        return { error: Texts.AUTH_ERROR };
    }

    async customerSignup(username, password) {
        return await this.createNewAccount(username, password, ACCOUNT_TYPES.Customer);
    }

    async employeeSignup(username, password) {
        return await this.createNewAccount(username, password, ACCOUNT_TYPES.Employee);
    }

    async createNewAccount(username, password, accountType, isActive = true) {
        const checkUsername = await this.isValidUsername(username);
        if (checkUsername.error)
            return checkUsername;

        if (!validatePassword(password))
            return Texts.INVALID_PASSWORD;

        return await this.create({ username, password, accountType, isActive });
    }

    /**
     * @param {string} username 
     */
    async isValidUsername(username) {
        if (!validateUsername(username))
            return { error: Texts.INVALID_USERNAME };

        const existAccount = await this.query({ username: username });
        if (existAccount.data.length > 0)
            return { error: Texts.USERNAME_ALREADY_EXISTS };

        return { username: username }
    }
}

export default new AccountService();