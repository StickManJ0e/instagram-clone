import React, { useState, useEffect } from "react";

const PostEdit = (props) => {
    const { imageSrc, setSelectedAspectRatio, selectedAspectRatio, caption } = props;
    const [divToggle, setDivToggle] = useState(false);
    const [imageStyle, setImageStyle] = useState({ aspectRatio: selectedAspectRatio });

    const openDivOptions = () => {
        if (divToggle === false) {
            setDivToggle(true);
        }
        else {
            setDivToggle(false);
        };
    };

    const selectAspectRatio = (e) => {
        setSelectedAspectRatio(e.target.textContent.toLowerCase());
    }

    useEffect(() => {
        (selectedAspectRatio === 'original') ? setImageStyle({ aspectRatio: 'auto' }) :
            (selectedAspectRatio === '1:1') ? setImageStyle({ aspectRatio: 1 / 1 }) :
                (selectedAspectRatio === '4:5') ? setImageStyle({ aspectRatio: 4 / 5 }) :
                    setImageStyle({ aspectRatio: 16 / 9 });

        let element = document.querySelector(`[option-value="${selectedAspectRatio}"]`);
        let elements = document.querySelectorAll('#resize-options>div');

        elements.forEach((element) => {
            element.classList.remove('selected');
        })

        if (element !== null) {
            element.classList.add('selected');
        }
    }, [selectedAspectRatio, divToggle]);

    return (
        <div className="edit-post-div">
            <div className="image-container">
                <img id="selected-file" src={imageSrc} alt="selected file" style={imageStyle}></img>
            </div>
            <div className="editing-container">
                <label htmlFor="caption"></label>
                {caption !== undefined ?
                    <textarea type="text" id="caption-input" name="caption" placeholder="Write a caption..." maxLength="2200" defaultValue={caption}></textarea> :
                    <textarea type="text" id="caption-input" name="caption" placeholder="Write a caption..." maxLength="2200"></textarea>
                }
                <div className="resize-div">
                    <div id="resize-option-button" onClick={() => openDivOptions()}>Resize</div>
                    {divToggle ?
                        <div id="resize-options">
                            <div option-value='original' onClick={(e) => selectAspectRatio(e)}>Original</div>
                            <div option-value='1:1' onClick={(e) => selectAspectRatio(e)}>1:1</div>
                            <div option-value='4:5' onClick={(e) => selectAspectRatio(e)}>4:5</div>
                            <div option-value='16:9' onClick={(e) => selectAspectRatio(e)}>16:9</div>
                        </div> :
                        <div></div>}
                </div>
            </div>
        </div>
    );
};

export default PostEdit;