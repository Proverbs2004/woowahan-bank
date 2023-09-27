import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setMissionData, setMissionDataClear } from 'redux/Mission';
import apis from 'services/api/apis';

function MissionParentResponseButton() {

    const { missionId } = useParams();
    const navigate = useNavigate();
    const missionData = useSelector((state) => state.mission.missionData);
    const dispatch = useDispatch();


    const data = {
        missionId: missionId,
        money: missionData.missionPoint
    };

    // 부모가 미션완료 수락하기 (포인트 지급)
    const handleAcceptMission = async () => {
        try {
            const userConfirmed = window.confirm("확인 버튼을 누르시면 포인트 지급이 됩니다.");

            if (userConfirmed) {
                const response = await apis.put('api/missions/give-money', data);
                alert("포인트 지급 완료.");
                apis.delete(`api/missions/${missionId}`);
                dispatch(setMissionDataClear());
                navigate("/mypage");

            }

        } catch (error) {
            console.error(error);
        }
    }

    // 부모가 미션 반려하기
    const handleRefuseMission = () => {
        try {
            const userConfirmed = window.confirm("확인 버튼을 누르시면 반려됩니다.");

            if (userConfirmed) {
                const response = apis.put(`api/missions/refuse/${missionId}`);
                // dispatch(setMissionData(...missionData, missionData.missionStatus='거절'));
                alert("반려 완료.");
                dispatch(setMissionData(response.data));
                navigate("/mypage");
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <button onClick={handleAcceptMission} >
                수락
            </button>
            <button onClick={handleRefuseMission} >
                거절
            </button>

        </div>
    )
}

export default MissionParentResponseButton;