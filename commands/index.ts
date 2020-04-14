import Discord from "discord.js";
import { Model } from "mongoose";
import { IAlert } from "../models/Alert";
import { IPrice } from "../models/Price";
import Stats from "./stats";
import Daisy from "./daisy";
import Nook from "./nook";
import Help from "./help";
import Today from "./today";
import Alert from "./alert";
import Calc from "./calc";

interface ExecuteArgs {
  msg: Discord.Message;
  args: string[];
  updateChannel: Discord.TextChannel;
  Price: Model<IPrice, {}>;
  Alert: Model<IAlert, {}>;
  bot: Discord.Client;
}

export type ExecuteFn = ({
  msg,
  args,
  updateChannel,
  Price,
  Alert,
  bot
}: ExecuteArgs) => Promise<any>;

export interface Command {
  name: string;
  description: string;
  execute: ExecuteFn;
}
export const commands: { [key: string]: Command } = {
  Stats,
  Daisy,
  Nook,
  Help,
  Today,
  Alert,
  Calc
};
