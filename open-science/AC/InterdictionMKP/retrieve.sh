# Benders
scp unibo_mini_pc_11:/home/hlefebvre/AdjustableRobustWithBinaryUncertainty/InterdictionMKP/solver/results.txt ./raw_results_benders.txt
cat raw_results_benders.txt | grep instance > results_benders.csv

# CCG
scp unibo_mini_pc_12:/home/hlefebvre/compare_RobustOptLagrangianDual.jl/src/results.txt ./results_ccg.csv