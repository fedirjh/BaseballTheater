﻿using System;
using System.Xml.Serialization;

namespace MlbDataEngine.Contracts
{
	[Serializable, XmlRoot("games")]
	public class GameSummaryCollection
	{
		[XmlAttribute("time_date", DataType="date")]
		public DateTime Date { get; set; }

		[XmlElement("game")]
		public GameSummary[] GameSummaries { get; set; }
	}
}