import {
    Configuration,
    CongressApi,
    CongressMemberListErrorResponse,
    ForbiddenErrorCodeEnum,
    ForbiddenErrorResponse, RateLimitErrorCodeEnum, RateLimitErrorResponse
} from "../dist";
import {
    CongressApiGetMembersRequest,
    CongressMemberListResponse,
    Chamber
} from "../dist";
import MockAdapter from "axios-mock-adapter";
import globalAxios, {AxiosError} from "axios";

const mockedAxios: MockAdapter = new MockAdapter(globalAxios);

describe("CongressApi - getMembers", () => {
    let api: CongressApi;

    beforeEach(() => {
        const config = new Configuration({
            apiKey: "test-api-key"
        });
        api = new CongressApi(config);
        mockedAxios.reset();
        jest.clearAllMocks();
    });

    it("should fetch members successfully with default parameters", async () => {
        const mockResponse = {
            members: [
                {
                    bioguideId: "A000000",
                    depiction: {
                        "attribution": "Image courtesy of the Member",
                        "imageUrl": "https://www.congress.gov/img/member/6734b6724c72e343a6aff9e6_200.jpg"
                    },
                    "district": 1,
                    name: "John Doe",
                    partyName: "Democrat",
                    state: "California",
                    terms: {
                        item: [
                            {
                                chamber: "House of Representatives",
                                startYear: 2020,
                                endYear: 2022
                            }
                        ]
                    },
                    updateDate: "2024-01-01T00:00:00Z"
                }
            ],
            pagination: {
                count: 1
            }
        };

        mockedAxios.onGet(/\/v3\/member(\?.*)?$/).reply(200, mockResponse);

        const response = await api.getMembers();
        const data: CongressMemberListResponse = response.data;

        expect(data).toBeDefined();
        expect(data.members).toBeDefined();
        expect(data.members.length).toBe(1);
        expect(data.members[0].bioguideId).toBe("A000000");
        expect(data.members[0].depiction).toBeDefined();
        expect(data.members[0].depiction!.attribution).toBe("Image courtesy of the Member");
        expect(data.members[0].depiction!.imageUrl).toBe("https://www.congress.gov/img/member/6734b6724c72e343a6aff9e6_200.jpg");
        expect(data.members[0].district).toBe(1);
        expect(data.members[0].name).toBe("John Doe");
        expect(data.members[0].partyName).toBe("Democrat");
        expect(data.members[0].state).toBe("California");
        expect(data.members[0].terms).toBeDefined();
        expect(data.members[0].terms.item).toBeDefined();
        expect(data.members[0].terms.item!.length).toBe(1);
        expect(data.members[0].terms.item![0].chamber).toBe(Chamber.HouseOfRepresentatives);
        expect(data.members[0].terms.item![0].startYear).toBe(2020);
        expect(data.members[0].terms.item![0].endYear).toBe(2022);
        expect(data.members[0].updateDate).toBe("2024-01-01T00:00:00Z");
        expect(data.pagination.count).toBe(1);
        expect(data.pagination.next).toBeUndefined();
        expect(data.pagination.prev).toBeUndefined();

        expect(mockedAxios.history.length).toBe(1);
        const request = mockedAxios.history[0];
        expect(request.data).toBeUndefined();
        expect(request.url).toContain("?api_key=test-api-key");
        expect(request.url).not.toContain("offset");
        expect(request.url).not.toContain("limit");
        expect(request.url).not.toContain("fromDateTime");
        expect(request.url).not.toContain("toDateTime");
        expect(request.url).not.toContain("currentMember");
    });

    it("should fetch members with all optional parameters", async () => {
        const mockResponse = {
            members: [],
            pagination: {
                count: 0
            }
        };

        mockedAxios.onGet().reply(200, mockResponse);

        const params: CongressApiGetMembersRequest = {
            offset: 0,
            limit: 250,
            fromDateTime: "2024-01-01T00:00:00Z",
            toDateTime: "2024-12-31T00:00:00Z",
            currentMember: true
        };

        await api.getMembers(params);

        expect(mockedAxios.history.length).toBe(1);
        const request = mockedAxios.history[0];
        expect(request.data).toBeUndefined();
        expect(request.url).toContain("api_key=test-api-key");
        expect(request.url).toContain("offset=0");
        expect(request.url).toContain("limit=250");
        expect(decodeURIComponent(request.url!)).toContain("fromDateTime=2024-01-01T00:00:00Z");
        expect(decodeURIComponent(request.url!)).toContain("toDateTime=2024-12-31T00:00:00Z");
        expect(request.url).toContain("currentMember=true");
    });

    describe("Error Handling", () => {
        it("should handle 400 errors when fetching members", async () => {
            mockedAxios.onGet().reply(400, {
                "error": "Bad request"
            });

            try {
                await api.getMembers();
            } catch (e) {
                const error = e as AxiosError;
                expect(error.message).toBe("Request failed with status code 400");
                expect(error.response).toBeDefined();
                expect(error.response!.status).toBe(400);
                expect(error.response!.data).toBeDefined();
                const errorResponse = error.response!.data as CongressMemberListErrorResponse;
                expect(errorResponse.error).toBe("Bad request");
            }
            expect.assertions(5);
        });

        it("should handle 403 invalid key errors when fetching members", async () => {
            mockedAxios.onGet().reply(403, {
                "error": {
                    "code": "API_KEY_INVALID",
                    "message": "API key is invalid"
                }
            });

            try {
                await api.getMembers();
            } catch (e) {
                const error = e as AxiosError;
                expect(error.message).toBe("Request failed with status code 403");
                expect(error.response).toBeDefined();
                expect(error.response!.status).toBe(403);
                expect(error.response!.data).toBeDefined();
                const errorResponse = error.response!.data as ForbiddenErrorResponse;
                expect(errorResponse.error).toBeDefined();
                expect(errorResponse.error.code).toBe(ForbiddenErrorCodeEnum.Invalid);
                expect(errorResponse.error.message).toBe("API key is invalid");
            }
            expect.assertions(7);
        });

        it("should handle 403 missing key errors when fetching members", async () => {
            mockedAxios.onGet().reply(403, {
                "error": {
                    "code": "API_KEY_MISSING",
                    "message": "API key is missing"
                }
            });
            try {
                await api.getMembers();
            } catch (e) {
                const error = e as AxiosError;
                const errorResponse = error.response!.data as ForbiddenErrorResponse;
                expect(errorResponse.error).toBeDefined();
                expect(errorResponse.error.code).toBe(ForbiddenErrorCodeEnum.Missing);
                expect(errorResponse.error.message).toBe("API key is missing");
            }
            expect.assertions(3);
        });


        it("should handle 429 rate limit errors when fetching members", async () => {
            mockedAxios.onGet().reply(429, {
                "error": {
                    "code": "OVER_RATE_LIMIT",
                    "message": "Rate limit exceeded"
                }
            });

            try {
                await api.getMembers();
            } catch (e) {
                const error = e as AxiosError;
                const errorResponse = error.response!.data as RateLimitErrorResponse;
                expect(errorResponse.error).toBeDefined();
                expect(errorResponse.error.code).toBe(RateLimitErrorCodeEnum.OverRateLimit);
                expect(errorResponse.error.message).toBe("Rate limit exceeded");
            }
            expect.assertions(3);

        });
    });
});