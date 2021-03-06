﻿import React = require("react");

interface ISearchBoxState
{
	currentValue: string;
}

interface ISearchBoxProps
{
	query: string;
	onPerformSearch: (newQuery: string) => void;
}

export class SearchBox extends React.Component<ISearchBoxProps, ISearchBoxState>
{
	constructor(props: ISearchBoxProps)
	{
		super(props);

		this.state = {
			currentValue: this.props.query
		}
	}

	public componentWillReceiveProps?(nextProps: Readonly<ISearchBoxProps>, nextContext: any)
	{
		this.setState({
			currentValue: nextProps.query
		})
	}

	private performSearch(query: string)
	{
		//LinkHandler.pushState(`/Search/${encodeURI(query)}`);
		this.props.onPerformSearch(query);
	}

	private onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
	{
		const value = (e.target as HTMLInputElement).value;
		this.setState({
			currentValue: value
		});
	}

	private onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) =>
	{
		const value = (event.target as HTMLInputElement).value;
		if (event.which === 13)
		{
			this.performSearch(value);
		}
	};

	public render()
	{
		return (
			<div className={`search`}>
				<input type="text" required onChange={this.onChange} value={this.state.currentValue} onKeyUp={this.onKeyUp}/>
				<div className={`label`}>
					<i className={`material-icons`}>search</i> <span>Search highlights</span>
				</div>
			</div>
		);
	}
}