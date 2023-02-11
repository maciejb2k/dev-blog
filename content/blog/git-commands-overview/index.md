---
title: Git common commands overview
date: 2023-02-11
description: Overview of most Git commands and how they work under the hood.
thumbnail: "./thumbnail.jpg"
author: "Maciej Biel"
authorPhoto: "./author.jpg"
readTime: "15"
---

Most of the commands have an simple explanation of what's going under the hood in git internals.

## `git`

### `git --version`
Checks the current version of git.

## `git add`
Adds files from the working area to the staging area.

```bash
git add .
git add <file-1> <file-2> <file-3>
git add -A
```

*Under the hood*:
Modifies `.git/index` file accordingly to the working area.

To interactively add files to the index, use:
```bash
git add -p
```

## `git branch`
A command for managing branches.

Lists all local branches:
```bash
git branch
```

*Under the hood*:
Lists files inside `.git/refs/heads/`.

Calculates the number of commits on the branch:
```bash
git rev-list --count <branch name>
```

Switches to previosuly used branch. The dash tells git to move to the branch we were using before switching.
```bash
git checkout -
```

### `git branch -a`
Shows all branches, including remotes:
```bash
git branch -a
```

*Under the hood*:
Lists individual files inside `.git/refs/heads/`. Shows information from `.git/packed-refs` file or individual files from `.git/refs/remotes/`.

### `git branch --track`
To create a tracking branch, use:
```bash
git branch --track <remote-branch>
```

*Under the hood*:
Adds an entry to `.git/config` file. Creates new branch in `.git/refs/heads/`.

### `git branch -v`
Displays all tracking branches (each command does the same):
```bash
git branch -v
git branch -vv
git branch --verbose
```

*Under the hood*:
Shows information from the `.git/config` file.

### `git branch -r`
Displays all remote-tracking branches on our machine:
```bash
git branch -r
```

### `git branch -d`
Deletes the local branch:
```bash
git branch -d <branch>
git branch --delete <branch>
```

### `git branch -D`
Deletes the local branch regardless of push and merge status.
```bash
git branch -D <branch>
git branch --delete --force <branch>
```

*Under the hood*:
Shows information from `.git/packed-refs` file or from individual files under `.git/refs/remotes/`.

### `git branch -m`
Renames current branch locally and remotely.
```bash
git checkout <old-name>
git branch -m <new-name>
git push origin -u <new-name>
git push origin --delete <old-name>
```

*Under the hood*:
Renames file inside `.git/refs/heads/<old-name>`.

### `git branch --merged`
To list all branches that have been merged into the currently checked-out branch, we can use:
```bash
git branch --merged
```

## `git bisect`
This command uses binary search to find the commit that introduced a bug.

```bash
git bisect <subcommand> <options>
```

## `git checkout`
This command is specifically about **updating the working tree**. It moves `HEAD` itself.

Switches between branches/commits. Updates working tree to reflect desired branch/commit.

Updates files in the working tree to match the version in the index or the specified tree.

If the branch is not specified, it will default to `HEAD`.

*Under the hood*:
Replaces content of `.git/HEAD` file with the path to ref (branch) or with commit hash (then it switches to detached HEAD). Updates reflog. Writes changes to the working directory and `.git/index`.

### `git checkout <branch>`
Checkouts to an existing branch.

*Under the hood*:
Updates contents of `.git/HEAD` with path to branch.

This command is doing too many things and is a source of confusion, so with Git 2.23 (Q3 2019) these two commands were introduced:
- `git switch`
- `git restore`

### `git checkout -b <branch>`
Checkouts to branch. If the branch doesn't exist, it creates a new one.

*Under the hood*:
Creates new branch inside `.git/refs/head/<new-branch>`, updates contents of `.git/HEAD` with path to new ref.

### `git checkout HEAD -- <filename>`
When executed, the file is replaced in the working tree with the version currently specified in HEAD commit. When HEAD is omitted, `HEAD` will be implicitly used.

Reverts changes to the file in the working area, in comparison to `git reset`, which removes the file only from the staging area, but keeps the changes. 

Affects the index and working tree. `git reset <filename>` changes only the index.

Where does checkout points to:
- `git checkout -- myfile.ext` - resets file to `Index` (replaces contents of the file with the version from staging/index).
- `git checkout HEAD -- myfile.ext` - resets file to `HEAD` (replaces contents of the file with the version from HEAD), it removes files from the index if staged.

*Under the hood*:
Finds compressed object in pack `.git/objects/packs/`, uncompress it and populate the working area with it. Nothing in `.git` is affected.

## `git commit`
Creates commit from files added to the staging area.

*Under the hood*:
Creates commit object under `.git/objects/`. Creates tree object (in `.git/objects/`) referenced inside new commit, based on `.git/index` file.

### `git commit --amend`
It adds staged changes to the previous commit.

If you don't want to edit the previous message, use this:
```bash
git commit --amend --no-edit
```

*Under the hood*:
Updates commit object inside `.git/objects/`.

### `git commit --dry-run`
Performs dry run and shows the summary of what will the next commit include.
```bash
git commit --dry-run
```

## `git cherry-pick`
Enables arbitrary Git commits to be picked by reference and appended to the current working HEAD. It copies commit and appends it at the top of current branch. Changes SHA1 like rebase. It is used, for example, for bug fixes.

```bash
git checkout main

git cherry-pick <hash>
git cherry-pick f

    a - b - c - d - f   Main
         \
           e - f - g Feature
```

### `git cherry-pick -edit`
Asks for a new message.

### `git cherry-pick -m`
When cherry picking merge commit, specifies the parent number:
```bash
git cherry-pick -m <parent-number>
```

## `git clean`
It is used for deleting untracked files in the repository.
```bash
git clean
```

Removes untracked files:
```bash
git clean -f
```

Recursively removes untracked files:
```bash
git clean -df
```

Recursively removes untracked and ignored files:
```bash
git clean -dfx
```

## `git clone`
Clones a repository into a new directory.

Cloning local repository.
```bash
git clone <src dir> <dest dir>
```

### `git clone --bare`
You can clone a bare repository, which only contains `.git` folder without the working directory, used mainly for synchronizing purposes.
```bash
git clone --bare <url>
```

## `git config`
Sets configuration values in Git.
- System - `/etc/gitconfig` - `git config --system`
- Global - `~/.gitconfig` - `git config --global`
- Local - `<repo>/.git/config` - `git config` or `git config --local`

*Under the hood*:
Updates information inside the config file, which location depends on provided parameters.

Shows where global config is stored:
```bash
git config --list --show-origin
```

Sets config values:
```bash
git config --global user.name
```

Unsets config values:
```bash
git config --unset --global user.name
```

Sets default branch name:
```bash
git config --global init.defaultBranch main
```

Sets pretty print:
```bash
 git config --global alias.lg "log --exclude='refs/notes/*' --all --decorate --oneline --graph"
```

## `git describe`
The command finds the most recent tag that is reachable from a commit. By default shows annotated tags.
```bash
git describe <branch>
git describe --all HEAD^
```

*Under the hood*:
Calculates the number of additional commits made since the creation of the new tag.

## `git diff`
Shows changes between the working tree and the index or a tree, changes between the index and a tree, changes between two trees, changes resulting from a merge, changes between two blob objects, or changes between two files on disk.
```bash
git diff
```

To review changes after staging a series of files:
```bash
git diff --cached
```

## `git diff-tree`
Displays a list of files added or modified in a specific commit:
```bash
git diff-tree <commit>
```

## `git fetch`
Fetches all the changes on the server that we don't have yet. It doesn't modify the working directory. We have to merge the data by ourselves.

*Under the hood*:
Fetches new objects to `.git/objects`.

### `git fetch origin`
Fetches all remote branches from the repository:
```bash
git fetch <remote name>
```

### `git fetch --dry-run`
Performs a demo run of `git fetch` command.

## `git help`
Prints git manual for given command:
```bash
git help reset
```

## `git init`
Creates an empty git repository or reinitializes an existing one.
```bash
git init
```

*Under the hood*:
Creates `.git/` hidden directory in the root of the working directory.

### `git init --bare`
A bare repository is a special kind of repository that does not have a working directory, meaning that it does not contain any of the files tracked by Git. Instead, it contains only the Git metadata, objects, and references.
```bash
git init --bare
```

## `git log`
Shows the commit logs.
```bash
git log
```

For better output, there is an additional set of parameters. The order of parameters is important:
```bash
git log --exclude='refs/notes/*' --all --decorate --oneline --graph 
```

*Under the hood*:
It uses a binary file stored under `.git/objects/info/commit-graph` containing the commits graph.

## `git merge`
In this example, we are going to merge `feature` to `develop` branch.

### `git merge --ff`
Only updates the branch pointer to match the merged branch. It doesn't create a merge commit.

```bash
git merge --ff <branch>

git checkout develop
git merge --ff feature
```

*Under the hood*:
Only updates pointer inside `.git/refs/heads/<branch>`, in our case `develop`.

### `git merge --squash`
Grabs all commits from `feature` branch, bundles them into one and puts on top of new, `develop`. It has only one parent, to `develop` branch.

```bash
git merge --squash <branch>

git checkout develop
git merge --squash feature
```

*Under the hood*:
Creates new commit object in `.git/objects`. Updates `HEAD`, or current branch to the new commit.

### `git merge --no-ff`
No fast forward merge is also called 3-way merge. Creates a new merge commit, uses "recursive strategy". New commit has two parents, to `develop` and `feature` branch.

```bash
git merge --no-ff <branch>

git checkout develop
git merge --no-ff  feature
```

*Under the hood*:
Creates new commit object in `.git/objects`. Updates `HEAD`, or current branch to the new commit.

### `git merge --abort`
If we encountered merge conflict, and we don't want to resolve it, we can abort merging with this command:
```bash
git merge --abort
```

## `git mv`
Renames file. It will automatically stage the file.
```bash
git mv <oldname> <newname>
```

*Under the hood*:
Renames file in working area, modifies `.git/index`.

## `git notes`
Creates additional notes for commits.

Adds nw notes:
```bash
git notes add -m "message"
git notes add -m "message" <commit>
```

*Under the hood*:
Creates a new commit-like object, which tree points to a new blob, which is our note (associated with commit, by default HEAD if not provided), and is stored in `.git/objects`, and that note is referenced from commit-like object referenced from `.git/refs/notes/commits`. Each add or delete of note is stored as separate commit-like object, parents are previous actions with notes, and latest note commit is referenced from `.git/refs/notes/commits`.

Shows notes for the particual commit:
```bash
git notes show <commit-id>
git show <commit-id>
```

Shows all notes:
```bash
git notes list

fa9fb59de27127b93b8decfbf8bd6df5adbbbcda 1f906fed5ecb90fc1ecbae70efebf8047b533c9d

git cat-file -p fa9fb59de27127b93b8decfbf8bd6df5adbbbcda

This is note content.

git cat-file -t fa9fb59de27127b93b8decfbf8bd6df5adbbbcda

blob
```

Removes notes:
```bash
git notes remove <commit>
```

## `git push`
Synchronizes changes from the local repository with the remote repository. Updates remote refs using local refs, while sending objects necessary to complete the given refs.

### `git push origin --delete`
Deletes the remote branch:
```bash
git push --delete <remote-name> <remote-branch>
```

### `git push origin -u`
Sets upstream for local branch:
```bash
git push origin -u <new_name>
```

## `git pull`
Fetches new objects and automatically merges them to the current branch.

*Under the hood*:
Executes `git fetch` and `git merge` automatically.

### `git pull --rebase`
Rebases commits instead of 3 way merge.

*Under the hood*:
Executes `git fetch` and `git rebase` automatically.

## `git reflog`
Shows "references log", a sorted list of commits on which HEAD used to point. Each command does the same thing. Reflog stores updates to branch tips and other references in the local repository.
```bash
git reflog
git reflog show
git log -g --abbrev-commit --pretty=oneline
```

*Under the hood*:
Shows contents of logs from `.git/logs/`.

## `git rebase`
Integrates changes from one branch to another.

```bash
git rebase <target-branch>
```

*Under the hood*:
Rewrites SHA-1 of commits from destination branch and modifies ref in `.git/refs/heads/<dest-branch>` to point at newly created commits.

To abort rebase:
```bash
git reset --abort
```

To undo rebase:
```bash
git reset --hard ORIG_HEAD
```

### `git rebase --interactive`
Allows you to rewrite a series of commits by reordering, editing, squashing, or splitting them.

```bash
git rebase -i
git rebase --interactive
```

To modify, squash, or fixup the last 10 commits, use:
```bash
git rebase -i HEAD~10
```

*Under the hood*:
Accordingly to the use case, creates new commits in `.git/objects/`.

## `git remote`
Lists all remotes:
```bash
git remote
```

*Under the hood*:
Reads contents of `.git/config` file.

### `git remote add`
Adds new remote repository under a given name.

*Under the hood*:
Modifies `.git/config` file and adds new remotes. Creates new directory inside `.git/refs/remotes/<origin name>` with remote name. 

When `git pull` or `git fetch` is invoked for the first time, it creates `.git/FETCH_HEAD` file with the last fetched state from the remote.

`.git/config` before adding remote:
```bash
[core]
        repositoryformatversion = 0
        filemode = true
        bare = false
        logallrefupdates = true
```

Adds new remote named origin:
```bash
git remote add origin git@github.com:<username>/<repository>.git
```

`.git/config` aftet adding remote:
```bash
[core]
        repositoryformatversion = 0
        filemode = true
        bare = false
        logallrefupdates = true
[remote "origin"]
        url = git@github.com:maciejb2k/remote-learning.git
        fetch = +refs/heads/*:refs/remotes/origin/*
```

### `git remote remove`
Removes the remote by name.

Usage:
```bash
git remote remove origin
```

*Under the hood*:
Removes entry inside `.git/config` about remote. 

### `git remote rename`
Renames the remote.

Usage:
```bash
git remote rename <old-name> <new-name>
```

*Under the hood*:
Renames entry inside `.git/config`. 

### `git remote -v`
Shows all remotes and their names.
```bash
git remote --v
git remote --verbosef
```

*Under the hood*:
Shows what's inside `.git/config`. 

### `git remote show origin`
View all remote branches from the given remote:
```bash
git remote show origin
```

*Under the hood*:
Views contents of `.git/config`. 

## `git reset`
This command is specifically about **updating the index**, which will move the branch `HEAD` points.

Used to take the current branch and reset it to point somewhere else, and possibly bring the index and working tree along.

*Under the hood*:
Updates commit pointer in branch `.git/refs/head/<branch name>` to point at different commit. It also updates `.git/index` file accordingly to the given options.

https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified

Using reset only makes sense in the context of: `HEAD`, `Staging Area`, and `Working Tree`.

Squashing using `git reset`:

Let's assume we have three commits, but the latest two have stupid commit messages and we want to change them. We can squash commits, by stepping back by two commits and persisting changes in the index, then just committing with new commit message.
```bash
git reset --soft HEAD~2
git commit
```

### `git reset --soft`
Moves pointer from branch to previous one. Restores working tree from previous commit, but persists changes in staging area.

Uncommit changes, changes are left staged (index).

Move back to previous commit:
```bash
git reset --soft HEAD\^
```

### `git reset --mixed`
Default option for `git reset`. Moves pointer from branch to previous one. Restores working tree from previous commit, but persists changes, which are ready to be staged.

Uncommit + unstaged changes, changes are left in the working tree.

Moves back to previous commit:
```bash
git reset --mixed HEAD~1^
```

### `git reset --hard`
Moves pointer from branch to previous one. Restores working tree from previous commit.

Uncommit + unstage + delete changes, nothing left.

Deletes commit and get back to deleted:
```bash
git reset --mixed HEAD~1
git reflog
git reset --hard 454dbf0
```

### `git reset <file>`

The first command without any option defaults to the second command:
```bash
git reset file.txt
git reset --mixed HEAD file.txt
```

Pull version of `file.txt` from given commit:
```bash
git reset eb43bf file.txt
```

## `git restore`
Relatively new command introduced in 2019 due to confusing `git checkout` command.
Used to restore working tree files. When file is deleted or modified, it can discard changes in working directory, and restore it.

Restores unstaged file (deleted or modified):
```bash
git restore <filename>
```

Restores staged file (deleted or modified):
```bash
git restore --stages <filename>
```

## `git revert`
Creates a new commit that undoes the changes from the previous commit. Doesn't modify project history.

*Under the hood*:
Creates new commit object in `.git/objects`.

### `git revert -m`
When reverting merge commmit, which hash multiple parents, we have to specify, which parent this revert commit will point to. It will give a tree from a given parent commit.
```bash
git revert -m <parent number>
```

## `git rm`
Removes files from the working tree and index.
Only for tracked files, which are committed in the index.
Automatically stages deleted files.

*Under the hood*:
Removes an entry from `.git/index` and removes a file from the working directory. 

How to undo?
```bash
git checkout HEAD -- <pathspec>
```

### `git rm --cached`
Stages the removal of the file from the repository.

```bash
➜  repository git:(master) ✗ git add .

➜  repository git:(master) ✗ git status
On branch master
Your branch is up to date with 'origin/master'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   file.txt

➜  repository git:(master) ✗ git rm --cached file.txt
rm 'file.txt'

➜  repository git:(master) ✗ git status
On branch master
Your branch is up to date with 'origin/master'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        deleted:    file.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        file.txt
```

## `git show`
Shows contents of git objects (commits, branches, tags, trees) or local files.
```bash
git show <branch-name>
git show <hash>
git show <tag-name>
```

To check file contents from the branch without switching:
```bash
git show <branch>:<name>
```

To display a histogram showing inserts, deletions, and modifications per file for a specific commit along with general commit information:
```bash
git show <commit> --stat
```

## `git show-ref`
Finds the HEAD of the current branch:
```bash
git show-ref --head
```

## `git stash`
Using stash without any parameters is the same as with `push`. It pops current changes to **stack** without untracked files.
```bash
git stash
git stash push
```

*Under the hood*:
Creates commit-like object, creates `.git/refs/stash` file containing hashes of these newly created objects, each hash is stored in a new line.

```bash
# Show contents of `stash` file
cat .git/refs/stash

9b9200841ad4f9945de4c2ce2bf130fd120bf025

# Show contents of object
git cat-file -p 9b9200841ad4f9945de4c2ce2bf130fd120bf025

tree ef7603d51b32d5499c6b649fe4c988e427886be2
parent 7bd8718b7e7d7ef5a009fefb7514c6b4e12e8dfd
parent 7e63ed46a224da8f27b78fe588a5cb623e9920d6
author John Doe <john.doe@example.com> 1675785186 +0100
committer John Doe <john.doe@example.com> 1675785186 +0100

WIP on master: 7bd8718 commit name
```

### `git stash -u`
Pops to stack changes including untracked files.
```bash
git stash -u
git stash --untraced
```

*Under the hood*:
Behaves the same, as in `git stash`.

### `git stash list`
Shows stashed changes.
```bash
git stash list
```

*Under the hood*:
Shows contents of `.git/refs/stash` and messages from objects resolved from their hashes.

### `git stash apply`
Applies changes from stash to the current working tree. 
```bash
git stash apply
git stash apply stash@{1}
```

*Under the hood*:
Resolves tree object, which stash commit-like object from `.git/refs/stash` points to, and applies changes to the current working directory.

### `git stash drop`
Removes the state from the stash list.
```bash
git stash drop
git stash drop stash@{5}
```
Deletes stash commit-like object from `.git/objects` and removes the reference from `.git/refs/stash`.


### `git stash pop`
Shorthand for:
```bash
git stash apply && git stash drop
```

## `git status`
Shows the working tree status.

Displays paths that have differences between the index file and the current HEAD commit, paths that have differences between the working tree and the index file, and paths in the working tree that are not tracked by Git

```bash
git status
```

*Under the hood*:
Searches for differences between the working tree and `.git/index` file. Refreshes `.git/index`. Stats from the working tree are cached.

### `git status --ignored`
Show ignored files.

```bash
git status --ignored
```

### `git status --untracked-files`
Shows untracked files.

```bash
git status -u
git status --untracked-files
```

## `git switch`
The command switches between branches. It was introduced due to the complexity of `git checkout`.

```bash
# Creates new branch
git branch <new-branch>

# Switches to newly created branch
git switch <new-branch>
```

*Under the hood*:
Replaces reference inside `.git/HEAD`.

Starts a new branch from remote with the same name:
```bash
git switch new-topic

Branch 'new-topic' set up to track remote branch 'new-topic' from 'origin'
Switched to a new branch 'new-topic'
```


## `git tag`
Lists existing tags in Git.
```bash
# List all
git tag
git tag --list

# List with prefix
git tag -l "v1.*"
```

*Under the hood*:
Lists tags from `.git/refs/tags/`.

Show information about the tag:
```bash
git show v1.4
```

*Under the hood*:
Lookups tag from `.git/refs/tags/<tagname>`, using `git cat-file -p` it prints contents of objects, which tag points to.

Checks whether tag is lightweight or annotated. `commit` means lightweight, `tag` means annotated.
```bash
git for-each-ref refs/tags 
902fa933e4a9d018574cbb7b5783a130338b47b8 commit refs/tags/v1.0-light
1f486472ccac3250c19235d843d196a3a7fbd78b tag    refs/tags/v1.1-annot
fd3cf147ac6b0bb9da13ae2fb2b73122b919a036 commit refs/tags/v1.2-light

git cat-file -t v1.0-light
commit

git cat-file -t v1.1-annot
tag
```

Checkouting to tag (switches to detached HEAD):
```bash
git checkout v2.0.0
```

*Under the hood*:
Replaces working tree with contents of working tree saved in the commit, which tag points to.

Working with tags on remote:
```bash
# Pushes a tag
git push origin <tagname>

# Pushes all tags
git push origin --tags

# Deletes tag from remote
git push origin --delete <tagname>
```

### `git tag <name>`
Creates lightweight tag. Don’t supply any of the -a, -s, or -m options.
```bash
git tag v1.4-lw
git tag
v0.1
v1.3
v1.4
v1.4-lw
v1.5
```

*Under the hood*:
Creates reference inside `.git/refs/tags/<tagname>`, and that reference points to `commit` object inside `.git/objects/`.

### `git tag -a`
Creates annotated tag.
```bash
# Without message, default editor will open
git tag -a "version uno X D"

# Specifying message in command
git tag -a "v1.4" -m "my version 1.4"
```

*Under the hood*:
Creates reference inside `.git/refs/tags/<tagname>`, creates tag object inside `.git/objects/` and that reference points to `tag` object.

### `git tag -d`
Deletes tag (annotated or lightweight).

```bash
git tag -d <name>
git tag --delete <name>
```

*Under the hood*:
Deletes reference from `.git/refs/tags/`. If the tag is annotated, it also deletes `tag` object from `.git/objects/`.