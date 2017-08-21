﻿namespace Theater
{
	function getTeamCode(team: Teams)
	{
		return MlbDataServer.Teams.TeamList[Teams[team]] || "None";
	}

	Vue.component("backer",
	{
		template: $("template#backer").html(),
		props: ["backer"],
		methods: {
		}
	});

	Vue.component("team-sponsor",
	{
		template: $("template#team-sponsor").html(),
		props: ["teamSponsorTeam"],
		methods: {
			getTeamCode,
			getTeamSponsorsCount: (teamCode: string | number) =>
			{
				return BackersList.Instance.getTeamSponsorsCount(teamCode);
			},
			getTeamSponsors: (teamCode: string | number) =>
			{
				return BackersList.Instance.getTeamSponsors(teamCode);
			}
		}
	});

	Vue.component("premium-sponsor",
	{
		template: $("template#premium-sponsor").html(),
		props: ["premiumSponsor"],
		methods: {
			getTeamCode
		}
	});
}