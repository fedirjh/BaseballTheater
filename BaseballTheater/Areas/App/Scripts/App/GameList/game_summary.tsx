﻿namespace Theater
{
	interface GameSummaryProps
	{
		game: GameSummaryData;
		index: number;
		hideScores: boolean;
	}

	interface IGameSummaryState
	{
		visible: boolean
	}

	enum HomeAway
	{
		None,
		Home,
		Away
	}

	export class GameSummary extends React.Component<GameSummaryProps, IGameSummaryState>
	{
		private loadingSubscription: Utility.Subscription<ILoadingPayload>;
		
		constructor(props: GameSummaryProps)
		{
			super(props);

			this.state = {
				visible: false
			};
		}

		private show()
		{
			this.setState({
				visible: true
			})
		}

		public componentDidMount()
		{
			setTimeout(() => this.show(), this.props.index * 25);

			this.loadingSubscription = App.Instance.loadingDistributor.subscribe(() =>
				this.setState({
					visible: false
				})
			);
		}

		public componentWillUnmount()
		{
			App.Instance.loadingDistributor.unsubscribe(this.loadingSubscription);
		}

		public componentWillReceiveProps(newProps: Readonly<GameSummaryProps>)
		{
			if (this.props.game.game_pk !== newProps.game.game_pk)
			{
				setTimeout(() => this.show(), this.props.index * 25);
			}
		}

		public render()
		{
			const game = this.props.game;

			const gameStatusClass = game.isFinal ? "final" : "";
			const visibleClass = this.state.visible ? "on" : "";


			return (
				<div className={`game-summary-simple ${gameStatusClass} ${visibleClass}`} data-homecode={game.home_file_code} data-awaycode={game.away_file_code}>
					<a href={this.getGameLink()} className={`game-link`}>
						<i className="material-icons">keyboard_arrow_right</i>
					</a>

					{this.renderTeamRow(HomeAway.Away)}

					<div className={`inning-status`}>
						<span>{this.getCurrentInning()}</span>
					</div>

					{this.renderTeamRow(HomeAway.Home)}
				</div>
			);
		}

		private renderTeamRow(teamType: HomeAway)
		{
			const game = this.props.game;

			const isWinner = this.getWinner() === teamType;
			const winnerClass = isWinner ? "winner" : "";
			const homeAwayClass = teamType === HomeAway.Away ? "away-team" : "home-team";
			const fileCode = teamType === HomeAway.Away ? game.away_file_code : game.home_file_code;
			const teamCity = teamType === HomeAway.Away ? game.away_team_city : game.home_team_city;
			const teamName = teamType === HomeAway.Away ? game.away_team_name : game.home_team_name;

			let linescoreRuns = "";

			if (game.linescore)
			{
				linescoreRuns = teamType === HomeAway.Away ? game.linescore.r.away : game.linescore.r.home;
			}

			return (
				<div className={`team-row ${homeAwayClass} ${winnerClass}`}>
					<div className={`team-info`}>
						<div className={`team-city team-color ${fileCode}`}>{teamCity}</div>
						<div className={`team-name team-color ${fileCode}`}>{teamName}</div>
					</div>
					{game.linescore &&
					<div className={`score`}>
						{this.linescoreItem(linescoreRuns)}
						<span className={`winner-indicator ${winnerClass}`}>
								<i className={`material-icons`}>chevron_left</i>
							</span>
					</div>
					}
				</div>
			);
		}

		private getGameLink(): string
		{
			const game = this.props.game;

			const dayString = game.dateObj.local().format("YYYYMMDD");
			return `/game/${dayString}/${game.game_pk}`;
		}

		private linescoreItem(input: string): string
		{
			return this.props.hideScores
				? "▨"
				: input;
		}

		private getCurrentInning(): string
		{
			const game = this.props.game;

			/*	if (game.status.note){
					return game.status.note;
				}*/

			if (game.isFinal)
			{
				const tieString = game.status.ind === "FT" ? " (Tie)" : "";
				return game.status.status + tieString;
			}

			if (game.status.reason)
			{
				return `${game.status.status} (${game.status.reason})`;
			}

			return game.status.inning_state
				? `${game.status.inning_state} ${game.status.inning}`
				: this.getStatusTime();
		}

		private getWinner(): HomeAway
		{
			const game = this.props.game;

			if (game.linescore && game.linescore.r && !this.props.hideScores && game.isFinal)
			{
				const away = parseInt(game.linescore.r.away);
				const home = parseInt(game.linescore.r.home);
				if (away !== home)
				{
					return parseInt(game.linescore.r.away) > parseInt(game.linescore.r.home)
						? HomeAway.Away
						: HomeAway.Home;
				}
			}

			return HomeAway.None;
		}

		private getStatusTime()
		{
			const game = this.props.game;

			var time = game.dateObj.local().format("h:mm a");
			var timeZone = moment.tz(0, moment.tz.guess()).zoneAbbr();

			return `${time} ${timeZone}`;
		}
	}
}