# Benders
sshpass -p $UNIBO_MINIPC_PWD scp unibo_mini_pc_11:/home/hlefebvre/AdjustableRobustWithBinaryUncertainty/InterdictionMKP/solver/results.txt ./raw_results_benders.txt || exit
cat raw_results_benders.txt | grep instance > results_benders.csv

# Benders
sshpass -p $UNIBO_MINIPC_PWD scp unibo_mini_pc_10:/home/hlefebvre/AdjustableRobustWithBinaryUncertainty/InterdictionMKP/solver/results.txt ./raw_results_benders_IIS.txt || exit
cat raw_results_benders_IIS.txt | grep instance > results_benders_IIS.csv

# CCG
sshpass -p $UNIBO_MINIPC_PWD scp unibo_mini_pc_12:/home/hlefebvre/compare_RobustOptLagrangianDual.jl/src/results.txt ./results_ccg.csv || exit