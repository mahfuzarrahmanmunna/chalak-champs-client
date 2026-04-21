import React from 'react';

const LittleChamps = () => {
    return (
      <div>
        <div>
          <h3 className='text-2xl md:text-5xl font-semibold tracking-[-5%] text-center'>
            <span className="text-[#00477C]">আমাদের</span>
            <span className="relative inline-block px-2 py-3 group">
              <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>
              <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
              <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
              <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
              <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
              <span className="text-primary">
                {" "}
                Little Champs&lsquo;রা
              </span>
            </span>

            <span className="bg-linear-to-r from-[#F3066D] to-[#FC7CB4] bg-clip-text text-transparent">
              পাচ্ছে
            </span>
          </h3>
        </div>
      </div>
    );
};

export default LittleChamps;