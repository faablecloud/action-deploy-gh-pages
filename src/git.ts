import * as io from "@actions/io";
import { exec } from "@actions/exec";
import * as core from "@actions/core";
import * as github from "@actions/github";
import * as path from "path";

const cwd = path.join(
  process.env.HOME as string,
  "/actions_publish_gh_pages_temporary_directory"
);

const git = async (cmd: string): Promise<number> => {
  return await exec(`git ${cmd}`, [], { cwd });
};

export const initialize = async () => {
  const token = core.getInput("token");
  const url = `https://${token}@github.com/${github.context.repo}.git`;
  core.info(`repo ${url}`);

  await io.mkdirP(cwd);

  await git("init");
  await git(`remote add origin "${url}"`);
  await git(`fetch --prune`);

  //io.cp(`${src}/.`, `${cwd}/.`, { recursive: true });

  await git(`add --all`);
  await git(`config user.name "faable.com"`);
  await git(`config user.email "noreply@faable.com"`);
  await git(`commit -m "build-gh-pages-faablecloud"`);
  await git(`config push.default current`);
  await git(`push origin`);
};
