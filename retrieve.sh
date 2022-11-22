# InterdictionMKP

## Benders
echo "Fetching InterdictionMKP-Benders..."
sshpass -p $UNIBO_MINIPC_PWD scp unibo_mini_pc_11:/home/hlefebvre/AdjustableRobustWithBinaryUncertainty/InterdictionMKP/solver/results_* ./open-science/AC/InterdictionMKP/ || exit
echo "Done"

## CCG
echo "Fetching InterdictionMKP-CCG..."
sshpass -p $UNIBO_MINIPC_PWD scp unibo_mini_pc_12:/home/hlefebvre/compare_RobustOptLagrangianDual.jl/src/results_ccg.csv ./open-science/AC/InterdictionMKP/ || exit
echo "Done"

# DisruptionFLP

# Benders
echo "Fetching DisruptionFLP-Benders..."
sshpass -p $UNIBO_MINIPC_PWD scp unibo_mini_pc_10:/home/hlefebvre/AdjustableRobustWithBinaryUncertainty/DisruptionFLP/solver/results_* ./open-science/AC/DisruptionFLP/ || exit
echo "Done"

# CCG
echo "Fetching DisruptionFLP-CCG..."
sshpass -p $UNIBO_MINIPC_PWD scp unibo_mini_pc_10:/home/hlefebvre/compare_RobustOptLagrangianDual.jl/src/results_* ./open-science/AC/DisruptionFLP/ || exit
echo "Done"
