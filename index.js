#!/usr/bin/env node
'use strict'
const program = require('commander')
var Actions = require('./actions')

var fs = require('fs')

var config

try {
  let config_path = process.cwd() + '/config.json'
  if (fs.existsSync(config_path)) {
    let content = fs.readFileSync(config_path)
    config = JSON.parse(content)
  }
} catch (ex) {
  console.log(ex)
}

var actions = new Actions(config)

program
  .version('0.1.1')
  .description('Hyperledger Burrow deployment tools')

program
  .command('initialize')
  .alias('init')
  .description('\nInitialize project, makes folders and files which are needed for starting a dapp project.\n\n')
  .action(() => actions.init())

program
  .command('compile')
  .alias('cmp')
  .description('\nCompile all contracts in contracts folder and makes artifacts in the build folder\
  \nyou need to initialize a project before using this command.\n\n')
  .action(() => actions.compileAll())

program
  .command('migrate [accountname] ')
  .option('-f, --force', 'forcely migrate the contracts')
  .alias('mgt')
  .description('\ndeploy contract on the Burrow\
  \nyou need to initialize a project before using this command.\n\n')
  .action((accountname, cmd) => actions.migrate(accountname, cmd.force))

program
  .command('list_accounts ')
  .alias('lsacc')
  .description('\nLoad all accounts\
  \nyou need to initialize a project before using this command.\n\n')
  .action(() => actions.loadAccounts())

program
  .command('default_accounts ')
  .alias('defacc')
  .description('\nList all predefined accounts\
  \nNo need to initialize a project before using this command.\n\n')
  .action(() => actions.getDefaultAccounts())

program
  .command('create_account <pass_phrase>')
  .alias('crtacc')
  .description('\nCreates unsafe account included private key, public key and address and displays on the terminal, \
  \nNo need to initialize a project before using this command.\n\n')
  .action((pass_phrase) => actions.createAccount(pass_phrase))

program
  .command('balance <address>')
  .alias('blnc')
  .description('\nGet balance of a specefic account\
  \nNo need to initialize a project before using this command.\n\n')
  .action((address) => actions.getBalance(address))

program
  .command('sequence <address>')
  .alias('seq')
  .description('\nGet sequence of a specefic account\
  \nNo need to initialize a project before using this command.\n\n')
  .action((address) => actions.getSequence(address))

program
  .command('transact <priv_key> <data> <address> <fee> <gas_limit>')
  .option('-u, --unsafe', 'unsafe sending transaction')
  .alias('tx')
  .description('\n(Unsafe!) Do regular transaction to a contract, you need pass the private key of sender and address of contract\
  \nyou need to initialize a project before using this command.\n\n')
  .action((priv_key, data, address, fee, gas_limit, cmd) => actions.transact(priv_key, data, address, fee, gas_limit, cmd.unsafe))

program
  .command('bond <priv_key> <address> <amount> <fee> <public_key>')
  .option('-u, --unsafe', 'unsafe sending transaction')
  .alias('bnd')
  .description('\n(safe) Do Bond transaction, you need pass the private key of sender and address of reciever\
  \nyou may need to initialize a project before using this command.\n\n')
  .action((priv_key, address, amount, fee, public_key, cmd) => actions.broadcastBond(priv_key, address, parseInt(amount), parseInt(fee), public_key, cmd.unsafe))

program
  .command('unbond <priv_key> <address> <amount> <fee>')
  .option('-u, --unsafe', 'unsafe sending transaction')
  .alias('ubnd')
  .description('\n(safe) Do Unbond transaction, you need pass the private key of sender and address of reciever\
  \nyou may need to initialize a project before using this command.\n\n')
  .action((priv_key, address, amount, fee, cmd) => actions.broadcastUnbond(priv_key, address, parseInt(amount), parseInt(fee), cmd.unsafe))

program
  .command('send <priv_key> <address> <amount> ')
  .option('-u, --unsafe', 'unsafe sending transaction')
  .alias('stx')
  .description('\n(safe) Do regular transaction, you need pass the private key of sender and address of reciever\
  \nyou need to initialize a project before using this command.\n\n')
  .action((priv_key, address, amount, cmd) => actions.send(priv_key, address, parseInt(amount), cmd.unsafe))

program
  .command('random_transact <count>')
  .alias('rtx')
  .description('\n(Unsafe!)Doing random Transaction, \
  \nyou need to initialize a project before using this command\
  \nyou should put a list of accounts(name = account_list.json) in accounts folder first!.\n\n')
  .action((count) => actions.randomTransact(count))

program
  .command('install')
  .alias('inst')
  .description('\ninstall burrow blockchain, and copy the files to the home directory (.burrow), \
  \nNo need to initialize project for this command.\n\n')
  .action(() => actions.installBurrow())

program
  .command('uninstall_burrow')
  .alias('unsl')
  .description('\nuninstall burrow blockchain, and back up the files to the home directory (burrow-backup), \
  \nNo need to initialize project for this command.\n\n')
  .action(() => actions.uninstallBurrow())

program
  .command('run')
  .alias('rn')
  .description('\nrun burrow blockchain,you need install burrow first!, \
  \nNo need to initialize project for this command.\n\n')
  .action(() => actions.burrow())

program
  .command('*')
  .action(function (others) {
    console.log('[Error] There isn\'t any command for "%s" \n\
    please type snack -h for more helps.\n', others)
  })

program
  .command('call <contract_name> <function_name> [parameters_list]')
  .alias('cltx')
  .description('\nCalls the function of specefic contract, you need to pass the list of parameters like this var1,var2,...,varK ,comma separated, \
  \nYou need to initialize a project before using this command.\n\n')
  .action((contract_name, function_name, parameters_list) => actions.callFunction(contract_name, function_name, parameters_list))

program
  .command('chain_id')
  .alias('chid')
  .description('\nGet chain id of the blockchain\
  \nYou need to initialize a project before using this command.\n\n')
  .action(() => actions.getChainId())

program
  .command('genesis_hash')
  .alias('genhash')
  .description('\nGet Genesis Hash of the blockchain\
  \nYou need to initialize a project before using this command.\n\n')
  .action(() => actions.getGenesisHash())

program
  .command('latest_block_height')
  .alias('lbckh')
  .description('\nGet Latest Block Hash of the blockchain\
  \nYou need to initialize a project before using this command.\n\n')
  .action(() => actions.getLatestBlockHeight())

program
  .command('info')
  .alias('inf')
  .description('\nGet Info of the blockchain\
  \nYou need to initialize a project before using this command.\n\n')
  .action(() => actions.getInfo())

  program
  .command('network')
  .alias('net')
  .description('\nGet the network information of the node\
  \nYou need to initialize a project before using this command.\n\n')
  .action(() => actions.getNetworkInfo())

program
  .command('latest_block')
  .alias('lblck')
  .description('\nGet Latest Block of the blockchain\
  \nYou may need to initialize a project before using this command.\n\n')
  .action(() => actions.getLatestBlock())

  program
  .command('consensus')
  .alias('cns')
  .description('\nGet consensus status of the blockchain\
  \nYou may need to initialize a project before using this command.\n\n')
  .action(() => actions.getConsensusInfo())


  program
  .command('account_info <acc>')
  .alias('accinf')
  .description('\nGet account information \
  \nYou may need to initialize a project before using this command.\n\n')
  .action((acc) => actions.getAccountInfo(acc))

  program
  .command('block  <block_height>')
  .alias('blk')
  .description('\nGet the specific Block of the blockchain\
  \nYou may need to initialize a project before using this command.\n\n')
  .action((block_height) => actions.getBlock(parseInt(block_height)))

program
  .command('list_transactions  <block_height>')
  .alias('ltxs')
  .description('\nGet transactions of the specific Block \
  \nYou may need to initialize a project before using this command.\n\n')
  .action((block_height) => actions.getBlockTxs(parseInt(block_height)))

program
  .command('config')
  .alias('cnf')
  .description("\nGet the current config of the snak\
  \nIf you haven't created any project burrow url will be http://127.0.0.1:1337/rpc by default\
  \nYou may need to initialize a project before using this command.\n\n")
  .action(() => actions.getConfig())

program.parse(process.argv)
