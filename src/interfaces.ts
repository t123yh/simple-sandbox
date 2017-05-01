export interface SandboxParameter {
    // Time limit, in milliseconds. -1 for no limit.
    time: number;

    // Memory limit, in bytes. -1 for no limit.
    memory: number;

    // The maximum child process count that may be created by the executable. Typically less than 10. -1 for no limit.
    process: number;

    // This is location of the root filesystem of the sandbox on your machine,
    // that will be mounted readonly when executing the sandboxed program as /.
    // You can use any Linux distribution you like as the rootfs.
    // Personally I would recommend using the Alpine Linux, but you can use Debian, CentOS, or any others you like.
    // See README.md for more details.
    // Note that the sandbox won't have any effect on its root,
    // so you can have any number of sandboxes using the same chroot synchronously.
    chroot: string;

    // This is the location of the binary directory on your machine.
    // This directory will be mounted to `/sandbox/binary` inside the sandbox at runtime.
    // It will be mounted read-only, but it is still recommended to have the correct permission set on the directory to not let
    // sandboxed program write here.

    binary?: string;
    // This is the location of the working directory on your machine.
    // This directory will be mounted to `/sandbox/working` inside the sandbox at runtime.
    // It will be mounted read-write. 
    // If the write permission is not set on the directory, the sandboxed program will not be able to write to it.
    working: string;

    // Whether to redirect the stdio before chroot (and setuid).
    // True indicates that stdio should be redirected before chrooting.
    // In this way, the path is relative to the current directory in the outside world, 
    // and may be anything like `/dev/stdout` to write output to the console.
    // False indicates that stdio should be redirected after chrooting.
    // In this way, the path is relative to the `/sandbox/working` directory, and the permission will be checked when creating the output files.
    redirectBeforeChroot: boolean;
    
    // Whether to mount `/proc` inside the sandbox.
    // The sandbox is under a PID namespace and the sandboxed program will see itself as PID 1.
    // The mounted `/proc` is corresponding to the PID namespace.
    // Some applications (like Node.js) requires `/proc` mounted in order to function correctly.
    // Some applications will also need `/sys` and `/dev`. Please bind mount them to your rootfs at your own risk.
    mountProc: boolean;

    // The executable file to be run.
    // You can specify a executable file in your binary directory. Note that the path is relative to the inside of the sandbox.
    // For example, if you have `a.out` in `/tmp/mydir`, you can specify `/tmp/mydir` as the binary directory,
    // and specify `/sandbox/binary/a.out` as the executable.
    // You can also spacify a executable in your rootfs. For example, `/usr/bin/python` or `/bin/sh`.
    executable: string;

    // The file to be redirected as the Standard Input / Output of your sandboxed program.
    // If redirectBeforeChroot is `true`, this will be the path in the outside world, 
    // or else it will be relative to the working directory of the sandbox (relative path specified),
    // or absolute path in the sandbox (absolute path specified).
    // If it is not specified, the stdio will be redirected to /dev/null.
    stdin?: string;
    stdout?: string;
    stderr?: string;

    // The user to run the sandboxed program with.
    // Please make sure that this user have the read permission to the chroot and binary directory,
    // and have read-write permission to the working directory.
    // Multiple sandboxes can share one user.
    user: string;

    // The Control Group (cgroup) name the sandbox will be put inside.
    // Please specify a unique name to each sandbox (ideally the name of the sandbox).
    // Currently, do not generate a random name each time, or there will be some junk files in the cgroup.
    cgroup: string;

    // The parameters to be passed to the executable.
    // Typically, the first parameter should be the same to the executable path.
    // For example, if you want to run a Python script, you should specify `['python', '1.py']`.
    parameters?: string[];

    // The environment variables to be passed to the executable.
    // Typically only the `PATH` environment variable is necessary.
    // You can have something like `['PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin']`.
    environments?: string[];
};

export enum SandboxStatus {
    Unknown = 0,
    OK = 1,
    TimeLimitExceeded = 2,
    MemoryLimitExceeded = 3,
    RuntimeError = 4,
    Cancelled = 5
};

export interface SandboxResult {
    status: SandboxStatus;
    time: number;
    memory: number;
    code: number;
};