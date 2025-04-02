import {
  Configuration,
  CongressApi,
  CongressApiGetMemberCosponsoredLegislationRequest,
  CongressApiGetMemberSponsoredLegislationRequest,
  CongressMemberListResponse,
  Chamber,
  CongressApiGetMembersRequest,
  CongressMemberDetailsResponse,
  CongressMemberListErrorResponse,
  ForbiddenErrorCodeEnum,
  ForbiddenErrorResponse,
  MemberCosponsoredLegislationResponse,
  ResourceNotFoundErrorResponse,
  MemberSponsoredLegislationResponse,
  RateLimitErrorCodeEnum,
  RateLimitErrorResponse,
  CongressApiGetMembersByStateAndDistrictRequest,
  CongressApiGetMembersByStateRequest,
} from "../dist";

import MockAdapter from "axios-mock-adapter";
import globalAxios, { AxiosError } from "axios";

const mockedAxios = new MockAdapter(globalAxios);
const config = new Configuration({
  apiKey: "test-api-key",
});
const api = new CongressApi(config);

const invalidKeyTest = (apiMethod: () => Promise<any>) =>
  it("should handle 403 invalid key errors", async () => {
    mockedAxios.onGet().reply(403, {
      error: {
        code: "API_KEY_INVALID",
        message: "API key is invalid",
      },
    });

    try {
      await apiMethod();
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

const missingKeyTest = (apiMethod: () => Promise<any>) =>
  it("should handle 403 missing key errors", async () => {
    mockedAxios.onGet().reply(403, {
      error: {
        code: "API_KEY_MISSING",
        message: "API key is missing",
      },
    });
    try {
      await apiMethod();
    } catch (e) {
      const error = e as AxiosError;
      const errorResponse = error.response!.data as ForbiddenErrorResponse;
      expect(errorResponse.error).toBeDefined();
      expect(errorResponse.error.code).toBe(ForbiddenErrorCodeEnum.Missing);
      expect(errorResponse.error.message).toBe("API key is missing");
    }
    expect.assertions(3);
  });

const resourceNotFoundTest = (apiMethod: () => Promise<any>) =>
  it("should handle 404 errors", async () => {
    mockedAxios.onGet().reply(404, {
      error: "Not found",
    });

    try {
      await apiMethod();
    } catch (e) {
      const error = e as AxiosError;
      expect(error.message).toBe("Request failed with status code 404");
      expect(error.response).toBeDefined();
      expect(error.response!.status).toBe(404);
      expect(error.response!.data).toBeDefined();
      const errorResponse = error.response!
        .data as ResourceNotFoundErrorResponse;
      expect(errorResponse.error).toBe("Not found");
    }
    expect.assertions(5);
  });

const rateLimitTest = (apiMethod: () => Promise<any>) =>
  it("should handle 429 rate limit errors", async () => {
    mockedAxios.onGet().reply(429, {
      error: {
        code: "OVER_RATE_LIMIT",
        message: "Rate limit exceeded",
      },
    });

    try {
      await apiMethod();
    } catch (e) {
      const error = e as AxiosError;
      const errorResponse = error.response!.data as RateLimitErrorResponse;
      expect(errorResponse.error).toBeDefined();
      expect(errorResponse.error.code).toBe(
        RateLimitErrorCodeEnum.OverRateLimit,
      );
      expect(errorResponse.error.message).toBe("Rate limit exceeded");
    }
    expect.assertions(3);
  });

describe("CongressApi - getMemberSponsoredLegislation", () => {
  beforeEach(() => {
    mockedAxios.reset();
    jest.clearAllMocks();
  });

  it("should fetch member sponsored legislation successfully", async () => {
    const mockResponse = {
      sponsoredLegislation: [
        {
          congress: 115,
          introducedDate: "2017-01-01",
          latestAction: {
            actionDate: "2017-01-01",
            actionTime: "12:00:00",
            text: "Motion to reconsider laid on the table Agreed to without objection.",
          },
          number: "1125",
          policyArea: {
            name: "Congress",
          },
          title: "Legislation title",
          type: "hres",
        },
      ],
      pagination: {
        count: 2,
        next: "https://api.congress.gov/v3/member/A000000/sponsored-legislation?offset=1",
      },
    };

    mockedAxios
      .onGet(/\/v3\/member\/A000000\/sponsored-legislation(\?.*)?$/)
      .reply(200, mockResponse);

    const response = await api.getMemberSponsoredLegislation({
      bioguideId: "A000000",
    });
    const data = response.data;

    expect(data).toBeDefined();
    expect(data.sponsoredLegislation).toBeDefined();
    expect(data.sponsoredLegislation.length).toBe(1);
    expect(data.sponsoredLegislation[0].congress).toBe(115);
    expect(data.sponsoredLegislation[0].introducedDate).toBe("2017-01-01");
    expect(data.sponsoredLegislation[0].latestAction).toBeDefined();
    expect(data.sponsoredLegislation[0].latestAction!.actionDate).toBe(
      "2017-01-01",
    );
    expect(data.sponsoredLegislation[0].latestAction!.actionTime).toBe(
      "12:00:00",
    );
    expect(data.sponsoredLegislation[0].latestAction!.text).toBe(
      "Motion to reconsider laid on the table Agreed to without objection.",
    );
    expect(data.sponsoredLegislation[0].number).toBe("1125");
    expect(data.sponsoredLegislation[0].policyArea).toBeDefined();
    expect(data.sponsoredLegislation[0].policyArea!.name).toBe("Congress");
    expect(data.sponsoredLegislation[0].title).toBe("Legislation title");
    expect(data.sponsoredLegislation[0].type).toBe("hres");
    expect(data.pagination).toBeDefined();
    expect(data.pagination.count).toBe(2);
    expect(data.pagination.next).toBe(
      "https://api.congress.gov/v3/member/A000000/sponsored-legislation?offset=1",
    );
    expect(data.pagination.prev).toBeUndefined();
    expect(mockedAxios.history.length).toBe(1);
  });

  it("should fetch member sponsored legislation with all optional parameters", async () => {
    const mockResponse: MemberSponsoredLegislationResponse = {
      sponsoredLegislation: [],
      pagination: {
        count: 0,
      },
    };

    mockedAxios.onGet().reply(200, mockResponse);

    const params: CongressApiGetMemberSponsoredLegislationRequest = {
      bioguideId: "A00000",
      offset: 10,
      limit: 50,
    };

    await api.getMemberSponsoredLegislation(params);

    expect(mockedAxios.history.length).toBe(1);
    const request = mockedAxios.history[0];
    expect(request.data).toBeUndefined();
    expect(request.url).toContain("api_key=test-api-key");
    expect(request.url).toContain("offset=10");
    expect(request.url).toContain("limit=50");
  });

  describe("Error Handling", () => {
    invalidKeyTest(() =>
      api.getMemberSponsoredLegislation({ bioguideId: "A000000" }),
    );
    missingKeyTest(() =>
      api.getMemberSponsoredLegislation({ bioguideId: "A000000" }),
    );
    resourceNotFoundTest(() =>
      api.getMemberSponsoredLegislation({ bioguideId: "A000000" }),
    );
    rateLimitTest(() =>
      api.getMemberSponsoredLegislation({ bioguideId: "A000000" }),
    );
  });
});

describe("CongressApi - getMemberCosponsoredLegislation", () => {
  beforeEach(() => {
    mockedAxios.reset();
    jest.clearAllMocks();
  });

  it("should fetch member cosponsored legislation successfully", async () => {
    const mockResponse = {
      cosponsoredLegislation: [
        {
          congress: 115,
          introducedDate: "2017-01-01",
          latestAction: {
            actionDate: "2017-01-01",
            actionTime: "12:00:00",
            text: "Motion to reconsider laid on the table Agreed to without objection.",
          },
          number: "1125",
          policyArea: {
            name: "Congress",
          },
          title: "Legislation title",
          type: "hres",
        },
      ],
      pagination: {
        count: 2,
        next: "https://api.congress.gov/v3/member/A000000/cosponsored-legislation?offset=1",
      },
    };

    mockedAxios
      .onGet(/\/v3\/member\/A000000\/cosponsored-legislation(\?.*)?$/)
      .reply(200, mockResponse);

    const response = await api.getMemberCosponsoredLegislation({
      bioguideId: "A000000",
    });
    const data = response.data;

    expect(data).toBeDefined();
    expect(data.cosponsoredLegislation).toBeDefined();
    expect(data.cosponsoredLegislation.length).toBe(1);
    expect(data.cosponsoredLegislation[0].congress).toBe(115);
    expect(data.cosponsoredLegislation[0].introducedDate).toBe("2017-01-01");
    expect(data.cosponsoredLegislation[0].latestAction).toBeDefined();
    expect(data.cosponsoredLegislation[0].latestAction!.actionDate).toBe(
      "2017-01-01",
    );
    expect(data.cosponsoredLegislation[0].latestAction!.actionTime).toBe(
      "12:00:00",
    );
    expect(data.cosponsoredLegislation[0].latestAction!.text).toBe(
      "Motion to reconsider laid on the table Agreed to without objection.",
    );
    expect(data.cosponsoredLegislation[0].number).toBe("1125");
    expect(data.cosponsoredLegislation[0].policyArea).toBeDefined();
    expect(data.cosponsoredLegislation[0].policyArea!.name).toBe("Congress");
    expect(data.cosponsoredLegislation[0].title).toBe("Legislation title");
    expect(data.cosponsoredLegislation[0].type).toBe("hres");
    expect(data.pagination).toBeDefined();
    expect(data.pagination.count).toBe(2);
    expect(data.pagination.next).toBe(
      "https://api.congress.gov/v3/member/A000000/cosponsored-legislation?offset=1",
    );
    expect(data.pagination.prev).toBeUndefined();
    expect(mockedAxios.history.length).toBe(1);
  });

  it("should fetch member cosponsored legislation with all optional parameters", async () => {
    const mockResponse: MemberCosponsoredLegislationResponse = {
      cosponsoredLegislation: [],
      pagination: {
        count: 0,
      },
    };

    mockedAxios.onGet().reply(200, mockResponse);

    const params: CongressApiGetMemberCosponsoredLegislationRequest = {
      bioguideId: "A00000",
      offset: 10,
      limit: 50,
    };

    await api.getMemberCosponsoredLegislation(params);

    expect(mockedAxios.history.length).toBe(1);
    const request = mockedAxios.history[0];
    expect(request.data).toBeUndefined();
    expect(request.url).toContain("api_key=test-api-key");
    expect(request.url).toContain("offset=10");
    expect(request.url).toContain("limit=50");
  });

  describe("Error Handling", () => {
    invalidKeyTest(() =>
      api.getMemberCosponsoredLegislation({ bioguideId: "A000000" }),
    );
    missingKeyTest(() =>
      api.getMemberCosponsoredLegislation({ bioguideId: "A000000" }),
    );
    resourceNotFoundTest(() =>
      api.getMemberCosponsoredLegislation({ bioguideId: "A000000" }),
    );
    rateLimitTest(() =>
      api.getMemberCosponsoredLegislation({ bioguideId: "A000000" }),
    );
  });
});

describe("CongressApi - getMemberDetails", () => {
  beforeEach(() => {
    mockedAxios.reset();
    jest.clearAllMocks();
  });

  it("should fetch member details successfully", async () => {
    const mockResponse = {
      member: {
        addressInformation: {
          city: "Washington",
          district: "DC",
          officeAddress: "1234 Capitol Hill",
          phoneNumber: "(202) 225-5665",
          zipCode: 20515,
        },
        bioguideId: "A000000",
        birthYear: 1970,
        cosponsoredLegislation: {
          count: 100,
        },
        currentMember: true,
        depiction: {
          attribution: "Image courtesy of the Member",
          imageUrl:
            "https://www.congress.gov/img/member/6734b6724c72e343a6aff9e6_200.jpg",
        },
        directOrderName: "John M. Doe",
        district: 1,
        firstName: "John",
        honorificName: "Mr.",
        invertedOrderName: "Doe, John M.",
        lastName: "Doe",
        leadership: [
          {
            congress: 115,
            current: false,
            type: "Speaker of the House",
          },
        ],
        middleName: "M.",
        nickName: "Johnny",
        officialWebsiteUrl: "https://www.doe.gov",
        partyHistory: [
          {
            partyAbbreviation: "R",
            partyName: "Republican",
            startYear: 2000,
            endYear: 2024,
          },
        ],
        sponsoredLegislation: {
          count: 100,
        },
        state: "Louisiana",
        terms: [
          {
            chamber: "House of Representatives",
            congress: 115,
            district: 4,
            endYear: 2019,
            memberType: "Representative",
            startYear: 2017,
            stateCode: "LA",
            stateName: "Louisiana",
          },
        ],
        updateDate: "2024-01-01T00:00:00Z",
      },
    };

    mockedAxios.onGet(/\/v3\/member\/A000000(\?.*)?$/).reply(200, mockResponse);

    const response = await api.getMemberDetails({ bioguideId: "A000000" });
    const data: CongressMemberDetailsResponse = response.data;

    expect(data).toBeDefined();
    expect(data.member).toBeDefined();
    expect(data.member.addressInformation).toBeDefined();
    expect(data.member.addressInformation!.city).toBe("Washington");
    expect(data.member.addressInformation!.district).toBe("DC");
    expect(data.member.addressInformation!.officeAddress).toBe(
      "1234 Capitol Hill",
    );
    expect(data.member.addressInformation!.phoneNumber).toBe("(202) 225-5665");
    expect(data.member.addressInformation!.zipCode).toBe(20515);
    expect(data.member.bioguideId).toBe("A000000");
    expect(data.member.birthYear).toBe(1970);
    expect(data.member.cosponsoredLegislation).toBeDefined();
    expect(data.member.cosponsoredLegislation!.count).toBe(100);
    expect(data.member.currentMember).toBe(true);
    expect(data.member.depiction).toBeDefined();
    expect(data.member.depiction!.attribution).toBe(
      "Image courtesy of the Member",
    );
    expect(data.member.depiction!.imageUrl).toBe(
      "https://www.congress.gov/img/member/6734b6724c72e343a6aff9e6_200.jpg",
    );
    expect(data.member.directOrderName).toBe("John M. Doe");
    expect(data.member.district).toBe(1);
    expect(data.member.firstName).toBe("John");
    expect(data.member.honorificName).toBe("Mr.");
    expect(data.member.invertedOrderName).toBe("Doe, John M.");
    expect(data.member.lastName).toBe("Doe");
    expect(data.member.leadership).toBeDefined();
    expect(data.member.leadership!.length).toBe(1);
    expect(data.member.leadership![0].congress).toBe(115);
    expect(data.member.leadership![0].current).toBe(false);
    expect(data.member.leadership![0].type).toBe("Speaker of the House");
    expect(data.member.middleName).toBe("M.");
    expect(data.member.nickName).toBe("Johnny");
    expect(data.member.officialWebsiteUrl).toBe("https://www.doe.gov");
    expect(data.member.partyHistory).toBeDefined();
    expect(data.member.partyHistory!.length).toBe(1);
    expect(data.member.partyHistory![0].partyAbbreviation).toBe("R");
    expect(data.member.partyHistory![0].partyName).toBe("Republican");
    expect(data.member.partyHistory![0].startYear).toBe(2000);
    expect(data.member.partyHistory![0].endYear).toBe(2024);
    expect(data.member.sponsoredLegislation).toBeDefined();
    expect(data.member.sponsoredLegislation!.count).toBe(100);
    expect(data.member.state).toBe("Louisiana");
    expect(data.member.terms).toBeDefined();
    expect(data.member.terms!.length).toBe(1);
    expect(data.member.terms![0].chamber).toBe(Chamber.HouseOfRepresentatives);
    expect(data.member.terms![0].congress).toBe(115);
    expect(data.member.terms![0].district).toBe(4);
    expect(data.member.terms![0].endYear).toBe(2019);
    expect(data.member.terms![0].memberType).toBe("Representative");
    expect(data.member.terms![0].startYear).toBe(2017);
    expect(data.member.terms![0].stateCode).toBe("LA");
    expect(data.member.terms![0].stateName).toBe("Louisiana");
    expect(data.member.updateDate).toBe("2024-01-01T00:00:00Z");
    expect(mockedAxios.history.length).toBe(1);
    const request = mockedAxios.history[0];
    expect(request.data).toBeUndefined();
    expect(request.url).toContain("?api_key=test-api-key");
  });

  describe("Error Handling", () => {
    invalidKeyTest(() => api.getMemberDetails({ bioguideId: "A000000" }));
    missingKeyTest(() => api.getMemberDetails({ bioguideId: "A000000" }));
    resourceNotFoundTest(() => api.getMemberDetails({ bioguideId: "A000000" }));
    rateLimitTest(() => api.getMemberDetails({ bioguideId: "A000000" }));
  });
});

describe("CongressApi - getMembers", () => {
  beforeEach(() => {
    mockedAxios.reset();
    jest.clearAllMocks();
  });

  it("should fetch members successfully with default parameters", async () => {
    const mockResponse = {
      members: [
        {
          bioguideId: "A000000",
          depiction: {
            attribution: "Image courtesy of the Member",
            imageUrl:
              "https://www.congress.gov/img/member/6734b6724c72e343a6aff9e6_200.jpg",
          },
          district: 1,
          name: "John Doe",
          partyName: "Democrat",
          state: "California",
          terms: {
            item: [
              {
                chamber: "House of Representatives",
                startYear: 2020,
                endYear: 2022,
              },
            ],
          },
          updateDate: "2024-01-01T00:00:00Z",
        },
      ],
      pagination: {
        count: 1,
      },
    };

    mockedAxios.onGet(/\/v3\/member(\?.*)?$/).reply(200, mockResponse);

    const response = await api.getMembers();
    const data: CongressMemberListResponse = response.data;

    expect(data).toBeDefined();
    expect(data.members).toBeDefined();
    expect(data.members.length).toBe(1);
    expect(data.members[0].bioguideId).toBe("A000000");
    expect(data.members[0].depiction).toBeDefined();
    expect(data.members[0].depiction!.attribution).toBe(
      "Image courtesy of the Member",
    );
    expect(data.members[0].depiction!.imageUrl).toBe(
      "https://www.congress.gov/img/member/6734b6724c72e343a6aff9e6_200.jpg",
    );
    expect(data.members[0].district).toBe(1);
    expect(data.members[0].name).toBe("John Doe");
    expect(data.members[0].partyName).toBe("Democrat");
    expect(data.members[0].state).toBe("California");
    expect(data.members[0].terms).toBeDefined();
    expect(data.members[0].terms.item).toBeDefined();
    expect(data.members[0].terms.item!.length).toBe(1);
    expect(data.members[0].terms.item![0].chamber).toBe(
      Chamber.HouseOfRepresentatives,
    );
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
    const mockResponse: CongressMemberListResponse = {
      members: [],
      pagination: {
        count: 0,
      },
    };

    mockedAxios.onGet().reply(200, mockResponse);

    const params: CongressApiGetMembersRequest = {
      offset: 0,
      limit: 250,
      fromDateTime: "2024-01-01T00:00:00Z",
      toDateTime: "2024-12-31T00:00:00Z",
      currentMember: true,
    };

    await api.getMembers(params);

    expect(mockedAxios.history.length).toBe(1);
    const request = mockedAxios.history[0];
    expect(request.data).toBeUndefined();
    expect(request.url).toContain("api_key=test-api-key");
    expect(request.url).toContain("offset=0");
    expect(request.url).toContain("limit=250");
    expect(decodeURIComponent(request.url!)).toContain(
      "fromDateTime=2024-01-01T00:00:00Z",
    );
    expect(decodeURIComponent(request.url!)).toContain(
      "toDateTime=2024-12-31T00:00:00Z",
    );
    expect(request.url).toContain("currentMember=true");
  });

  describe("Error Handling", () => {
    it("should handle 400 errors when fetching members", async () => {
      mockedAxios.onGet().reply(400, {
        error: "Bad request",
      });

      try {
        await api.getMembers();
      } catch (e) {
        const error = e as AxiosError;
        expect(error.message).toBe("Request failed with status code 400");
        expect(error.response).toBeDefined();
        expect(error.response!.status).toBe(400);
        expect(error.response!.data).toBeDefined();
        const errorResponse = error.response!
          .data as CongressMemberListErrorResponse;
        expect(errorResponse.error).toBe("Bad request");
      }
      expect.assertions(5);
    });

    invalidKeyTest(() => api.getMembers());
    missingKeyTest(() => api.getMembers());
    rateLimitTest(() => api.getMembers());
  });
});

describe("CongressApi - getMembersByStateAndDistrict", () => {
  beforeEach(() => {
    mockedAxios.reset();
    jest.clearAllMocks();
  });

  it("should fetch members successfully with default parameters", async () => {
    const mockResponse = {
      members: [
        {
          bioguideId: "A000000",
          depiction: {
            attribution: "Image courtesy of the Member",
            imageUrl:
              "https://www.congress.gov/img/member/6734b6724c72e343a6aff9e6_200.jpg",
          },
          district: 1,
          name: "John Doe",
          partyName: "Democrat",
          state: "California",
          terms: {
            item: [
              {
                chamber: "House of Representatives",
                startYear: 2020,
                endYear: 2022,
              },
            ],
          },
          updateDate: "2024-01-01T00:00:00Z",
        },
      ],
      pagination: {
        count: 1,
      },
    };

    mockedAxios.onGet(/\/v3\/member\/CA\/1(\?.*)?$/).reply(200, mockResponse);

    const response = await api.getMembersByStateAndDistrict({
      stateCode: "CA",
      district: "1",
    });
    const data: CongressMemberListResponse = response.data;

    expect(data).toBeDefined();
    expect(data.members).toBeDefined();
    expect(data.members.length).toBe(1);
    expect(data.members[0].bioguideId).toBe("A000000");
    expect(data.members[0].depiction).toBeDefined();
    expect(data.members[0].depiction!.attribution).toBe(
      "Image courtesy of the Member",
    );
    expect(data.members[0].depiction!.imageUrl).toBe(
      "https://www.congress.gov/img/member/6734b6724c72e343a6aff9e6_200.jpg",
    );
    expect(data.members[0].district).toBe(1);
    expect(data.members[0].name).toBe("John Doe");
    expect(data.members[0].partyName).toBe("Democrat");
    expect(data.members[0].state).toBe("California");
    expect(data.members[0].terms).toBeDefined();
    expect(data.members[0].terms.item).toBeDefined();
    expect(data.members[0].terms.item!.length).toBe(1);
    expect(data.members[0].terms.item![0].chamber).toBe(
      Chamber.HouseOfRepresentatives,
    );
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
    const mockResponse: CongressMemberListResponse = {
      members: [],
      pagination: {
        count: 0,
      },
    };

    mockedAxios.onGet().reply(200, mockResponse);

    const params: CongressApiGetMembersByStateAndDistrictRequest = {
      stateCode: "CA",
      district: "1",
      offset: 0,
      limit: 250,
      fromDateTime: "2024-01-01T00:00:00Z",
      toDateTime: "2024-12-31T00:00:00Z",
      currentMember: true,
    };

    await api.getMembersByStateAndDistrict(params);

    expect(mockedAxios.history.length).toBe(1);
    const request = mockedAxios.history[0];
    expect(request.data).toBeUndefined();
    expect(request.url).toContain("api_key=test-api-key");
    expect(request.url).toContain("offset=0");
    expect(request.url).toContain("limit=250");
    expect(decodeURIComponent(request.url!)).toContain(
      "fromDateTime=2024-01-01T00:00:00Z",
    );
    expect(decodeURIComponent(request.url!)).toContain(
      "toDateTime=2024-12-31T00:00:00Z",
    );
    expect(request.url).toContain("currentMember=true");
  });

  describe("Error Handling", () => {
    it("should handle 400 errors when fetching members by state code and district", async () => {
      mockedAxios.onGet().reply(400, {
        error: "Bad request",
      });

      try {
        await api.getMembersByStateAndDistrict({
          stateCode: "CA",
          district: "1",
        });
      } catch (e) {
        const error = e as AxiosError;
        expect(error.message).toBe("Request failed with status code 400");
        expect(error.response).toBeDefined();
        expect(error.response!.status).toBe(400);
        expect(error.response!.data).toBeDefined();
        const errorResponse = error.response!
          .data as CongressMemberListErrorResponse;
        expect(errorResponse.error).toBe("Bad request");
      }
      expect.assertions(5);
    });

    invalidKeyTest(() =>
      api.getMembersByStateAndDistrict({ stateCode: "CA", district: "1" }),
    );
    missingKeyTest(() =>
      api.getMembersByStateAndDistrict({ stateCode: "CA", district: "1" }),
    );
    resourceNotFoundTest(() =>
      api.getMembersByStateAndDistrict({ stateCode: "CAA", district: "1" }),
    );
    rateLimitTest(() =>
      api.getMembersByStateAndDistrict({ stateCode: "CA", district: "1" }),
    );
  });
});

describe("CongressApi - getMembersByState", () => {
  beforeEach(() => {
    mockedAxios.reset();
    jest.clearAllMocks();
  });

  it("should fetch members by state successfully", async () => {
    const mockResponse: CongressMemberListResponse = {
      members: [
        {
          bioguideId: "A000000",
          depiction: {
            attribution: "Biographical Directory of the United States Congress",
            imageUrl:
              "https://bioguide.congress.gov/bioguide/photo/A/A000000.jpg",
          },
          district: 1,
          name: "Test Member",
          partyName: "Democratic",
          state: "CA",
          terms: {
            item: [
              {
                chamber: Chamber.HouseOfRepresentatives,
                startYear: 2021,
                endYear: 2023,
              },
            ],
          },
          updateDate: "2023-01-01T00:00:00Z",
        },
      ],
      pagination: {
        count: 1,
        next: "https://api.congress.gov/v3/member/CA?offset=1",
      },
    };

    mockedAxios.onGet(/\/v3\/member\/CA(\?.*)?$/).reply(200, mockResponse);

    const response = await api.getMembersByState({ stateCode: "CA" });
    const data = response.data;

    expect(data).toBeDefined();
    expect(data.members).toBeDefined();
    expect(data.members.length).toBe(1);
    expect(data.members[0].bioguideId).toBe("A000000");
    expect(data.members[0].district).toBe(1);
    expect(data.members[0].name).toBe("Test Member");
    expect(data.members[0].partyName).toBe("Democratic");
    expect(data.members[0].state).toBe("CA");
    expect(data.members[0].terms.item).toBeDefined();
    expect(data.members[0].terms.item!.length).toBe(1);
    expect(data.members[0].terms.item![0].chamber).toBe(
      Chamber.HouseOfRepresentatives,
    );
    expect(data.members[0].terms.item![0].startYear).toBe(2021);
    expect(data.members[0].terms.item![0].endYear).toBe(2023);
    expect(data.pagination).toBeDefined();
    expect(data.pagination.count).toBe(1);
    expect(data.pagination.next).toBe(
      "https://api.congress.gov/v3/member/CA?offset=1",
    );
    expect(mockedAxios.history.length).toBe(1);
  });

  it("should fetch members by state with all optional parameters", async () => {
    const mockResponse: CongressMemberListResponse = {
      members: [],
      pagination: {
        count: 0,
      },
    };

    mockedAxios.onGet().reply(200, mockResponse);

    const params: CongressApiGetMembersByStateRequest = {
      stateCode: "CA",
      offset: 10,
      limit: 50,
      fromDateTime: "2023-01-01T00:00:00Z",
      toDateTime: "2023-12-31T00:00:00Z",
      currentMember: true,
    };

    await api.getMembersByState(params);

    expect(mockedAxios.history.length).toBe(1);
    const request = mockedAxios.history[0];
    expect(request.data).toBeUndefined();
    expect(request.url).toContain("api_key=test-api-key");
    expect(request.url).toContain("offset=10");
    expect(request.url).toContain("limit=50");
    expect(decodeURIComponent(request.url!)).toContain(
      "fromDateTime=2023-01-01T00:00:00Z",
    );
    expect(decodeURIComponent(request.url!)).toContain(
      "toDateTime=2023-12-31T00:00:00Z",
    );
    expect(request.url).toContain("currentMember=true");
  });

  describe("Error Handling", () => {
    it("should handle 400 errors when fetching members by state", async () => {
      mockedAxios.onGet().reply(400, {
        error: "Bad request",
      });

      try {
        await api.getMembersByState({ stateCode: "CA" });
      } catch (e) {
        const error = e as AxiosError;
        expect(error.message).toBe("Request failed with status code 400");
        expect(error.response).toBeDefined();
        expect(error.response!.status).toBe(400);
        expect(error.response!.data).toBeDefined();
        const errorResponse = error.response!
          .data as CongressMemberListErrorResponse;
        expect(errorResponse.error).toBe("Bad request");
      }
      expect.assertions(5);
    });

    invalidKeyTest(() => api.getMembersByState({ stateCode: "CA" }));
    missingKeyTest(() => api.getMembersByState({ stateCode: "CA" }));
    resourceNotFoundTest(() => api.getMembersByState({ stateCode: "CA" }));
    rateLimitTest(() => api.getMembersByState({ stateCode: "CA" }));
  });
});

describe("CongressApi - getMembersByCongress", () => {
  beforeEach(() => {
    mockedAxios.reset();
    jest.clearAllMocks();
  });

  it("should fetch members by congress successfully", async () => {
    const mockResponse: CongressMemberListResponse = {
      members: [
        {
          bioguideId: "A000000",
          depiction: {
            attribution: "Biographical Directory of the United States Congress",
            imageUrl:
              "https://bioguide.congress.gov/bioguide/photo/A/A000000.jpg",
          },
          district: 1,
          name: "Test Member",
          partyName: "Democratic",
          state: "CA",
          terms: {
            item: [
              {
                chamber: Chamber.HouseOfRepresentatives,
                startYear: 2023,
                endYear: 2025,
              },
            ],
          },
          updateDate: "2023-01-01T00:00:00Z",
        },
      ],
      pagination: {
        count: 1,
        next: "https://api.congress.gov/v3/member/congress/118?offset=1",
      },
    };

    mockedAxios
      .onGet(/\/v3\/member\/congress\/118(\?.*)?$/)
      .reply(200, mockResponse);

    const response = await api.getMembersByCongress({ congress: 118 });
    const data = response.data;

    expect(data).toBeDefined();
    expect(data.members).toBeDefined();
    expect(data.members.length).toBe(1);
    expect(data.members[0].bioguideId).toBe("A000000");
    expect(data.members[0].name).toBe("Test Member");
    expect(data.members[0].partyName).toBe("Democratic");
    expect(data.members[0].state).toBe("CA");
    expect(data.members[0].district).toBe(1);
    expect(data.members[0].terms.item).toBeDefined();
    expect(data.members[0].terms.item!.length).toBe(1);
    expect(data.members[0].terms.item![0].chamber).toBe(
      Chamber.HouseOfRepresentatives,
    );
    expect(data.members[0].terms.item![0].startYear).toBe(2023);
    expect(data.members[0].terms.item![0].endYear).toBe(2025);
    expect(data.pagination).toBeDefined();
    expect(data.pagination.count).toBe(1);
    expect(data.pagination.next).toBe(
      "https://api.congress.gov/v3/member/congress/118?offset=1",
    );
    expect(data.pagination.prev).toBeUndefined();
    expect(mockedAxios.history.length).toBe(1);
  });

  it("should fetch members by congress with all optional parameters", async () => {
    const mockResponse: CongressMemberListResponse = {
      members: [],
      pagination: {
        count: 0,
      },
    };

    mockedAxios.onGet().reply(200, mockResponse);

    const params = {
      congress: 118,
      offset: 10,
      limit: 50,
      fromDateTime: "2023-01-01T00:00:00Z",
      toDateTime: "2023-12-31T00:00:00Z",
      currentMember: true,
    };

    await api.getMembersByCongress(params);

    expect(mockedAxios.history.length).toBe(1);
    const request = mockedAxios.history[0];
    expect(request.data).toBeUndefined();
    expect(request.url).toContain("api_key=test-api-key");
    expect(request.url).toContain("offset=10");
    expect(request.url).toContain("limit=50");
    expect(decodeURIComponent(request.url!)).toContain(
      "fromDateTime=2023-01-01T00:00:00Z",
    );
    expect(decodeURIComponent(request.url!)).toContain(
      "toDateTime=2023-12-31T00:00:00Z",
    );
    expect(request.url).toContain("currentMember=true");
  });

  describe("Error Handling", () => {
    it("should handle 400 errors when fetching members by congress", async () => {
      mockedAxios.onGet().reply(400, {
        error: "Bad request",
      });

      try {
        await api.getMembersByCongress({ congress: 118 });
      } catch (e) {
        const error = e as AxiosError;
        expect(error.message).toBe("Request failed with status code 400");
        expect(error.response).toBeDefined();
        expect(error.response!.status).toBe(400);
        expect(error.response!.data).toBeDefined();
        const errorResponse = error.response!
          .data as CongressMemberListErrorResponse;
        expect(errorResponse.error).toBe("Bad request");
      }
      expect.assertions(5);
    });

    invalidKeyTest(() => api.getMembersByCongress({ congress: 118 }));
    missingKeyTest(() => api.getMembersByCongress({ congress: 118 }));
    resourceNotFoundTest(() => api.getMembersByCongress({ congress: 118 }));
    rateLimitTest(() => api.getMembersByCongress({ congress: 118 }));
  });
});
