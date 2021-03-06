import { Guild, GuildMember } from "discord.js";
import express from "express";
import { API } from "../structures/API";
import Levels from 'discord-xp';
import profileSchema from "../models/profileSchema";

const router = express.Router();

router.get("/", async(req, res) => {
    res.status(403).json({
        status: 403,
        error: "GUILD_NOT_GIVEN"
    });
});

router.get("/:guild", async(req, res) => {
    res.status(403).json({
        status: 403,
        error: "USER_NOT_GIVEN"
    });
});

router.get("/:guild/:user", async(req, res) => {
    if(API.client.guilds.cache.get(req.params.guild)) {
        const guild: Guild = API.client.guilds.cache.get(req.params.guild);
        if(guild.members.cache.get(req.params.user)) {
            const member: GuildMember = guild.members.cache.get(req.params.user);
            const user = await Levels.fetch(member.user.id, guild.id);
            let neededXp = Levels.xpFor(user.level + 1);
            if(typeof neededXp != 'number') {
                neededXp = Levels.xpFor(1);
            }
            let profileData;
            try {
                profileData = await profileSchema.findOne({ userID: member.id, serverID: member.guild.id });
                if(!profileData) {
                    let profile = await profileSchema.create({
                        userID: member.id,
                        serverID: member.guild.id,
                        warnings: 0
                    });
                    profile.save();
                    profileData = await profileSchema.findOne({ userID: member.id, serverID: member.guild.id });
                }
            } catch (e) {
                console.error(e);
            }
            res.status(200).json({
                status: 200,
                name: member.nickname,
                ranking: {
                    level: user.level,
                    xp: user.xp,
                    neededXp: neededXp
                },
                warnings: profileData.warnings
            });
        } else {
            res.status(404).json({
                status: 404,
                error: "MEMBER_NOT_FOUND"
            });
        }
    } else {
        res.status(404).json({
            status: 404,
            error: "GUILD_NOT_FOUND"
        });
    }
});

export default router;