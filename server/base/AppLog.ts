import chalk from 'chalk'
import debug from 'debug'

export default class AppLog {
    private d: debug.Debugger
    constructor(private name: string) {
        this.d = debug(name)
    }
    info(msg: string) {
        this.d(chalk.bgWhite.black('INFO') + ' ' + msg)
        // console.log(chalk.bgWhite.black(this.name) + ': ' + msg);
    }
    warn(msg: string) {
        this.d(chalk.bgYellow.black('WARN') + ' ' + chalk.yellow(msg))
        // console.log(chalk.bgYellow.black(this.name) + ': ' + chalk.yellow(msg));
    }
    error(msg: string) {
        this.d(chalk.bgRed('ERROR') + ' ' + chalk.red(msg))
        // console.log(chalk.bgRed(this.name) + ': ' + chalk.red(msg));
    }
}
