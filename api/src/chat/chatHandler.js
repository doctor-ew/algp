"use strict";
// /packages/backend/src/chat/chatHandler.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessGraphQLResponse = exports.sendToGraphQLServer = exports.generateGraphQLQuery = exports.fetchSortedMorties = void 0;
const openai_1 = require("openai");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// Fetch data from a URL
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url);
            return response.data;
        }
        catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    });
}
// Sort Morties data
const sortData = (data, sortBy, order = 'desc') => {
    return order === 'asc' ? data.sort((a, b) => a[sortBy] - b[sortBy]) : data.sort((a, b) => b[sortBy] - a[sortBy]);
};
// Fetch and sort Morties based on given arguments
const fetchSortedMorties = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetchData("https://www.doctorew.com/shuttlebay/cleaned_pocket_morties.json");
    // Determine the sorting order based on the presence of 'first' or 'last'
    const sortOrder = args.last !== undefined ? 'asc' : 'desc';
    // Sort the data
    const sortedData = sortData(data, args.sortBy, sortOrder);
    // Determine the number of results to return
    let results = [];
    if (args.first !== undefined) {
        // If 'first' is defined, take the first N items
        results = sortedData.slice(0, args.first);
    }
    else if (args.last !== undefined) {
        // If 'last' is defined, reverse the sorted data and take the first N items
        results = sortedData.reverse().slice(0, args.last);
    }
    else {
        // Default case if neither 'first' nor 'last' is defined
        results = sortedData.slice(0, 5); // Default to 5 items if neither is specified
    }
    // Map the results to the expected format
    return results.map(morty => ({ node: morty, cursor: `cursor-${morty.id}` }));
});
exports.fetchSortedMorties = fetchSortedMorties;
// Function to generate a GraphQL query using OpenAI
function generateGraphQLQuery(userInput) {
    var _a, e_1, _b, _c;
    var _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        console.log('|-o-| |-g-| Generating GraphQL query for user input:', userInput);
        const openAiPrompt = `
    Translate the following user request into a GraphQL query. Use 'first' for top or best requests and 'last' for worst, lowest, or bottom requests. The fields are: id, name, assetid, basehp, baseatk, basedef, basespd, basexp. 
    
    All graph queries require a sortedMorties func call with a sortBy with a string and a first or last designator. The sortBy string can be any of the fields listed above. The first or last designator  is the user-requested number. The graph calls require a node and cursor. The node is the data requested and the cursor is a string. Please use the following format for the query:

    Examples:
    User Request: "Show the top 3 Morties by base attack"
    GraphQL Query: "query { sortedMorties(sortBy: \"baseatk\", first: 3){node {...} cursor }}"

    User Request: "Show the worst 5 Morties by base defense"
    GraphQL Query: "query { sortedMorties(sortBy: \"basedef\", last: 5){node {...} cursor }}"

    Your task is to create similar GraphQL queries based on the user input.
    User Request: "${userInput}"
`;
        try {
            const stream = yield openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: openAiPrompt },
                    { role: "user", content: userInput }
                ],
                max_tokens: 150,
                stream: true,
            });
            console.log("|-ooo-| openAiPrompt:", openAiPrompt);
            console.log("|-oOo-| userInput:", userInput);
            let gqlQuery = "";
            try {
                for (var _f = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _f = true) {
                    _c = stream_1_1.value;
                    _f = false;
                    const chunk = _c;
                    const content = ((_e = (_d = chunk.choices[0]) === null || _d === void 0 ? void 0 : _d.delta) === null || _e === void 0 ? void 0 : _e.content) || "";
                    gqlQuery += content;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_f && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            console.log("|-oooo-| Raw response from OpenAI:", gqlQuery);
            // Override check for 'worst', 'lowest', or 'bottom'
            if (userInput.toLowerCase().includes("worst") || userInput.toLowerCase().includes("lowest") || userInput.toLowerCase().includes("least") || userInput.toLowerCase().includes("bottom")) {
                gqlQuery = gqlQuery.replace("first:", "last:");
            }
            // Replace incorrect field names if necessary
            const fieldMapping = {
                "attack": "baseatk", // Add other mappings as necessary
            };
            // Replace incorrect field names in the query
            for (const key in fieldMapping) {
                if (fieldMapping.hasOwnProperty(key)) {
                    const mappedKey = key; // Assert the key type
                    gqlQuery = gqlQuery.replace(new RegExp(mappedKey, "g"), fieldMapping[mappedKey]);
                }
            }
            console.log("|-OO-| Generated GraphQL query:", gqlQuery);
            return gqlQuery;
        }
        catch (error) {
            console.error("Error in generating GraphQL query:", error);
            throw error;
        }
    });
}
exports.generateGraphQLQuery = generateGraphQLQuery;
// Function to send the GraphQL query to your GraphQL server
function sendToGraphQLServer(gqlQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('|-oo-| Sending GraphQL query to server:', gqlQuery);
        try {
            const response = yield axios_1.default.post('http://local.doctorew.com:4000/rickmorty', {
                query: gqlQuery,
            });
            return response.data;
        }
        catch (error) { // Change to 'any' to avoid TypeScript errors
            console.error("Error sending GraphQL query to server:", error);
            if (axios_1.default.isAxiosError(error)) {
                // Handle Axios-specific errors
                if (error.response) {
                    // Server responded with a status code that falls out of the range of 2xx
                    console.error("Server Response:", error.response.data);
                }
                else if (error.request) {
                    // The request was made but no response was received
                    console.error("No response received:", error.request);
                }
                else {
                    // Something happened in setting up the request that triggered an Error
                    console.error("Error Message:", error.message);
                }
            }
            else {
                // Handle non-Axios errors
                console.error("Error:", error);
            }
            throw new Error('Failed to send GraphQL query');
        }
    });
}
exports.sendToGraphQLServer = sendToGraphQLServer;
// Function to assess the GraphQL response and generate a meaningful message
function assessGraphQLResponse(graphqlResponse) {
    //console.log('Assessing GraphQL response:', graphqlResponse);
    // Check for errors in the GraphQL response
    if (graphqlResponse.errors) {
        console.error('GraphQL Errors:', graphqlResponse.errors);
        return { error: "Error in GraphQL response", details: graphqlResponse.errors };
    }
    // Assuming a successful response, process it as needed
    // This processing will depend on your specific requirements and the structure of your GraphQL data
    const processedResponse = processGraphQLData(graphqlResponse.data);
    return processedResponse;
}
exports.assessGraphQLResponse = assessGraphQLResponse;
// Function to process GraphQL data
function processGraphQLData(data) {
    if (!data || !(data === null || data === void 0 ? void 0 : data.sortedMorties)) {
        return { error: "No data returned" };
    }
    // Extracting Morties data
    const morties = data === null || data === void 0 ? void 0 : data.sortedMorties.map((edge) => edge === null || edge === void 0 ? void 0 : edge.node);
    console.log('|-O-| Extracted Morties:', morties);
    // Return in a format your frontend expects
    return { morties };
}
