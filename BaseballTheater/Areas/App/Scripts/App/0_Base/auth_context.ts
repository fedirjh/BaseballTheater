﻿namespace Theater
{
	export interface IAuthContext
	{
		IsAuthenticated: boolean;
	}

	export class AuthContext implements IAuthContext
	{
		public IsAuthenticated: boolean;

		public static Instance = new AuthContext();

		public initialize()
		{
			const pageData = Utility.PageData.getPageData<IAuthContext>("AuthContext");
			if (pageData)
			{
				this.IsAuthenticated = pageData.IsAuthenticated;
			}
		}
	}
}